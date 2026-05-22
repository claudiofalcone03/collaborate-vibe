
-- Enums
CREATE TYPE public.collaboration_role AS ENUM ('producer','rapper','vocalist','mix_engineer','developer','designer','marketer','other');
CREATE TYPE public.request_status AS ENUM ('pending','accepted','declined');

-- collaboration_requests
CREATE TABLE public.collaboration_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL,
  receiver_id uuid NOT NULL,
  content_id uuid NOT NULL REFERENCES public.contents(id) ON DELETE CASCADE,
  message text NOT NULL CHECK (char_length(message) BETWEEN 10 AND 500),
  role public.collaboration_role NOT NULL,
  portfolio_url text CHECK (portfolio_url IS NULL OR char_length(portfolio_url) <= 300),
  status public.request_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX collab_req_unique_pending ON public.collaboration_requests (sender_id, content_id) WHERE status = 'pending';
CREATE INDEX collab_req_receiver_status ON public.collaboration_requests (receiver_id, status);
CREATE INDEX collab_req_sender_created ON public.collaboration_requests (sender_id, created_at);

ALTER TABLE public.collaboration_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view requests" ON public.collaboration_requests
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Sender can create request" ON public.collaboration_requests
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Receiver can update status" ON public.collaboration_requests
  FOR UPDATE USING (auth.uid() = receiver_id) WITH CHECK (auth.uid() = receiver_id);

-- conversations
CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a uuid NOT NULL,
  user_b uuid NOT NULL,
  content_id uuid REFERENCES public.contents(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (user_a < user_b)
);
CREATE UNIQUE INDEX conversations_unique ON public.conversations (user_a, user_b, COALESCE(content_id, '00000000-0000-0000-0000-000000000000'::uuid));

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view conversations" ON public.conversations
  FOR SELECT USING (auth.uid() = user_a OR auth.uid() = user_b);

CREATE POLICY "Participants can create conversations" ON public.conversations
  FOR INSERT WITH CHECK (auth.uid() = user_a OR auth.uid() = user_b);

-- conversation_messages
CREATE TABLE public.conversation_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX conv_msg_conv_created ON public.conversation_messages (conversation_id, created_at);

ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_conversation_participant(_conv uuid, _user uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversations
    WHERE id = _conv AND (user_a = _user OR user_b = _user)
  );
$$;

CREATE POLICY "Participants read messages" ON public.conversation_messages
  FOR SELECT USING (public.is_conversation_participant(conversation_id, auth.uid()));

CREATE POLICY "Participants send messages" ON public.conversation_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND public.is_conversation_participant(conversation_id, auth.uid())
  );

-- Anti-spam + receiver enforcement trigger
CREATE OR REPLACE FUNCTION public.enforce_request_limits()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  owner uuid;
  recent_count int;
BEGIN
  SELECT owner_id INTO owner FROM public.contents WHERE id = NEW.content_id;
  IF owner IS NULL THEN
    RAISE EXCEPTION 'Content not found';
  END IF;
  IF owner = NEW.sender_id THEN
    RAISE EXCEPTION 'You cannot request collaboration on your own content';
  END IF;
  NEW.receiver_id := owner;

  SELECT count(*) INTO recent_count
  FROM public.collaboration_requests
  WHERE sender_id = NEW.sender_id AND created_at > now() - interval '24 hours';
  IF recent_count >= 5 THEN
    RAISE EXCEPTION 'Daily collaboration request limit reached (5 per 24h)';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_enforce_request_limits
  BEFORE INSERT ON public.collaboration_requests
  FOR EACH ROW EXECUTE FUNCTION public.enforce_request_limits();

-- Accept trigger creates a conversation
CREATE OR REPLACE FUNCTION public.on_request_accepted()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  ua uuid;
  ub uuid;
BEGIN
  IF NEW.status = 'accepted' AND OLD.status IS DISTINCT FROM 'accepted' THEN
    IF NEW.sender_id < NEW.receiver_id THEN
      ua := NEW.sender_id; ub := NEW.receiver_id;
    ELSE
      ua := NEW.receiver_id; ub := NEW.sender_id;
    END IF;
    INSERT INTO public.conversations (user_a, user_b, content_id)
    VALUES (ua, ub, NEW.content_id)
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_on_request_accepted
  AFTER UPDATE ON public.collaboration_requests
  FOR EACH ROW EXECUTE FUNCTION public.on_request_accepted();

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.collaboration_requests;
ALTER TABLE public.conversation_messages REPLICA IDENTITY FULL;
ALTER TABLE public.collaboration_requests REPLICA IDENTITY FULL;
