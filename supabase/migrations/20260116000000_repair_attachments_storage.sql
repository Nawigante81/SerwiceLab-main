-- Storage bucket for repair attachments
insert into storage.buckets (id, name, public)
values ('repair-attachments', 'repair-attachments', false)
on conflict (id) do nothing;

-- Policies for repair attachments
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Users can upload repair attachments'
  ) then
    create policy "Users can upload repair attachments"
      on storage.objects
      for insert
      to authenticated
      with check (
        bucket_id = 'repair-attachments'
        and auth.uid() = owner
        and name like auth.uid() || '/%'
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Users can view repair attachments'
  ) then
    create policy "Users can view repair attachments"
      on storage.objects
      for select
      to authenticated
      using (
        bucket_id = 'repair-attachments'
        and auth.uid() = owner
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Users can update repair attachments'
  ) then
    create policy "Users can update repair attachments"
      on storage.objects
      for update
      to authenticated
      using (
        bucket_id = 'repair-attachments'
        and auth.uid() = owner
      )
      with check (
        bucket_id = 'repair-attachments'
        and auth.uid() = owner
        and name like auth.uid() || '/%'
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Users can delete repair attachments'
  ) then
    create policy "Users can delete repair attachments"
      on storage.objects
      for delete
      to authenticated
      using (
        bucket_id = 'repair-attachments'
        and auth.uid() = owner
      );
  end if;
end $$;
