-- Additional indexes for repairs listing and status filters
CREATE INDEX IF NOT EXISTS repairs_user_status_created_at_idx
  ON public.repairs (user_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS repairs_user_active_created_at_idx
  ON public.repairs (user_id, created_at DESC)
  WHERE archived_at IS NULL;
