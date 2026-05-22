
REVOKE EXECUTE ON FUNCTION public.enforce_request_limits() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.on_request_accepted() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_conversation_participant(uuid, uuid) FROM PUBLIC, anon, authenticated;
