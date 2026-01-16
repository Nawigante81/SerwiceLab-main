-- Archive support for admin lists
ALTER TABLE public.cost_estimates
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

ALTER TABLE public.contact_messages
ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS cost_estimates_archived_at_idx
  ON public.cost_estimates (archived_at);

CREATE INDEX IF NOT EXISTS contact_messages_archived_at_idx
  ON public.contact_messages (archived_at);
