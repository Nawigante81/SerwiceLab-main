-- Profile preferences for settings
alter table public.profiles
  add column if not exists notification_email boolean default true,
  add column if not exists notification_sms boolean default true,
  add column if not exists newsletter boolean default false,
  add column if not exists dark_mode boolean default true,
  add column if not exists two_factor_enabled boolean default false;
