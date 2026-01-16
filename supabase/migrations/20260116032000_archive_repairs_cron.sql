-- Daily archive job for old repairs

CREATE EXTENSION IF NOT EXISTS pg_cron;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM cron.job
    WHERE jobname = 'archive_old_repairs_daily'
  ) THEN
    PERFORM cron.schedule(
      'archive_old_repairs_daily',
      '0 2 * * *',
      $cron$SELECT public.archive_old_repairs(180);$cron$
    );
  END IF;
END $$;
