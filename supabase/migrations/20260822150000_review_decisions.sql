-- Editorial decisions on researched content proposals.
--
-- The proposals themselves are bundled with the owner console and live in
-- version control. Only the decisions live here, because they are made a few
-- at a time over days and must persist the instant they are made — a review
-- session lost to a closed tab is the fastest way to abandon a tool like this.
--
-- Read is admin-only. Unlike app_config, which describes packaging and is
-- public by design, this table contains half-finished editorial judgement
-- about real places and real businesses — "possibly closed", "unsafe",
-- "could not verify" — and none of that should be readable before a human has
-- decided whether it is true.

create table if not exists public.review_decisions (
  -- Matches ReviewItem.id in the bundled queue, e.g. 'access_note:emerson-point:01'.
  item_id      text primary key,
  status       text not null default 'pending'
                 check (status in ('pending','accepted','rewritten','skipped','needs_info')),
  -- The owner's own wording, when the proposal was nearly right. Null means
  -- "ship the proposal as written".
  final_text   text,
  note         text,
  decided_at   timestamptz,
  -- Set once the accepted text has actually reached src/data and shipped.
  -- Guide content is compiled into the bundle, so accepting queues an edit
  -- rather than publishing one; this is what separates the two.
  published_at timestamptz,
  updated_at   timestamptz not null default now()
);

create index if not exists review_decisions_status_idx on public.review_decisions (status);

alter table public.review_decisions enable row level security;

drop policy if exists "admin read decisions" on public.review_decisions;
create policy "admin read decisions"
  on public.review_decisions for select to authenticated using (public.is_admin());

drop policy if exists "admin write decisions" on public.review_decisions;
create policy "admin write decisions"
  on public.review_decisions for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

revoke all on public.review_decisions from anon;

create trigger set_updated_at before update on public.review_decisions
  for each row execute function extensions.moddatetime(updated_at);
