-- Each authenticated user may access only their own plant records.
-- Remove previous policies because permissive PostgreSQL policies combine with OR.
do $$
declare
  policy_record record;
begin
  for policy_record in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'plantas'
  loop
    execute format('drop policy %I on public.plantas', policy_record.policyname);
  end loop;
end;
$$;

alter table public.plantas enable row level security;

create policy "Users can read their own plants"
  on public.plantas
  for select
  to authenticated
  using ((select auth.uid()) = usuario_id);

create policy "Users can insert their own plants"
  on public.plantas
  for insert
  to authenticated
  with check ((select auth.uid()) = usuario_id);

create policy "Users can update their own plants"
  on public.plantas
  for update
  to authenticated
  using ((select auth.uid()) = usuario_id)
  with check ((select auth.uid()) = usuario_id);

create policy "Users can delete their own plants"
  on public.plantas
  for delete
  to authenticated
  using ((select auth.uid()) = usuario_id);
