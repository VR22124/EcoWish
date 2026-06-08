create table action_logs (
  id uuid default gen_random_uuid() primary key,
  action_title text not null,
  carbon_saved_kg numeric not null default 0,
  category text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table action_logs enable row level security;

-- Create policy for public access (since this is a simple local app without full auth)
create policy "Enable all access for all users" on action_logs
  for all using (true) with check (true);
