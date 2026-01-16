-- Database optimization: indexes, archiving, pagination support

-- Add archive column for repairs
ALTER TABLE public.repairs
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

-- Indexes for frequent filters/sorts
CREATE INDEX IF NOT EXISTS repairs_user_id_created_at_idx
  ON public.repairs (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS repairs_status_idx
  ON public.repairs (status);

CREATE INDEX IF NOT EXISTS repairs_created_at_idx
  ON public.repairs (created_at DESC);

CREATE INDEX IF NOT EXISTS repairs_archived_at_idx
  ON public.repairs (archived_at);

CREATE INDEX IF NOT EXISTS cost_estimates_repair_id_idx
  ON public.cost_estimates (repair_id);

CREATE INDEX IF NOT EXISTS cost_estimates_status_idx
  ON public.cost_estimates (status);

CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx
  ON public.contact_messages (created_at DESC);

-- Function to archive old repairs
CREATE OR REPLACE FUNCTION public.archive_old_repairs(days_old INTEGER DEFAULT 180)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  archived_count INTEGER;
BEGIN
  UPDATE public.repairs
  SET archived_at = now()
  WHERE archived_at IS NULL
    AND created_at < now() - make_interval(days => days_old)
    AND status IN ('completed', 'delivered');

  GET DIAGNOSTICS archived_count = ROW_COUNT;
  RETURN archived_count;
END;
$$;
