
-- Enums
CREATE TYPE public.profile_type AS ENUM ('music_creator', 'project_creator', 'visitor');
CREATE TYPE public.content_type AS ENUM ('music', 'project');

-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  profile_type public.profile_type NOT NULL DEFAULT 'visitor',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- contents
CREATE TABLE public.contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type public.content_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  audio_url TEXT,
  image_url TEXT,
  vision TEXT,
  skills TEXT[],
  stage TEXT,
  model TEXT,
  genre TEXT,
  likes_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contents are viewable by everyone"
  ON public.contents FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create content"
  ON public.contents FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update their content"
  ON public.contents FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners can delete their content"
  ON public.contents FOR DELETE USING (auth.uid() = owner_id);

CREATE INDEX idx_contents_likes ON public.contents (likes_count DESC);
CREATE INDEX idx_contents_created ON public.contents (created_at DESC);
CREATE INDEX idx_contents_type ON public.contents (content_type);

-- likes
CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES public.contents(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, content_id)
);
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes are viewable by everyone"
  ON public.likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like"
  ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike own likes"
  ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- profile auto-create trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uname TEXT;
  ptype public.profile_type;
BEGIN
  uname := COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1));
  -- ensure uniqueness
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = uname) LOOP
    uname := uname || floor(random()*10000)::text;
  END LOOP;

  ptype := COALESCE((NEW.raw_user_meta_data->>'profile_type')::public.profile_type, 'visitor');

  INSERT INTO public.profiles (id, username, profile_type)
  VALUES (NEW.id, uname, ptype);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- likes count trigger
CREATE OR REPLACE FUNCTION public.handle_like_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.contents SET likes_count = likes_count + 1 WHERE id = NEW.content_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.contents SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.content_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER on_like_insert
  AFTER INSERT ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.handle_like_change();
CREATE TRIGGER on_like_delete
  AFTER DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.handle_like_change();

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('audio', 'audio', true)
  ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('covers', 'covers', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Audio public read"
  ON storage.objects FOR SELECT USING (bucket_id = 'audio');
CREATE POLICY "Authenticated upload audio to own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'audio' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Owners delete own audio"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Covers public read"
  ON storage.objects FOR SELECT USING (bucket_id = 'covers');
CREATE POLICY "Authenticated upload covers to own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'covers' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Owners delete own covers"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'covers' AND auth.uid()::text = (storage.foldername(name))[1]);
