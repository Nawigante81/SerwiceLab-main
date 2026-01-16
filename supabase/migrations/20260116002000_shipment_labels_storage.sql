-- Storage bucket for shipment labels
insert into storage.buckets (id, name, public)
values ('shipment-labels', 'shipment-labels', false)
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Users can view shipment labels'
  ) then
    create policy "Users can view shipment labels"
      on storage.objects
      for select
      to authenticated
      using (
        bucket_id = 'shipment-labels'
        and auth.uid() = owner
      );
  end if;
end $$;
