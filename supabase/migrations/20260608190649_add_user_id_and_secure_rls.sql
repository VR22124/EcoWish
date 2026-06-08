-- Add user_id column
alter table action_logs add column user_id uuid not null default gen_random_uuid();

-- Drop old insecure policy
drop policy "Enable all access for all users" on action_logs;

-- Create secure policies
-- Since we are passing the user_id from the frontend via a custom header or just directly in the payload,
-- and we are not using full Supabase Auth, we can use the anon role and restrict based on the payload.
-- But wait, standard RLS with anon role doesn't easily trust the payload for SELECT unless we set a local variable or just filter it in the query.
-- The most robust way without Supabase Auth is to just let anon insert, and filter by user_id.
-- BUT to prevent users from querying OTHER users' data, we can define a policy that checks a custom HTTP header.
-- `current_setting('request.headers', true)::json->>'x-user-id'`

create policy "Users can insert their own logs" on action_logs for insert
  with check (true); -- Insert payload dictates user_id, which we trust since it's anonymous

create policy "Users can view their own logs" on action_logs for select
  using (user_id::text = current_setting('request.headers', true)::json->>'x-user-id');

create policy "Users can delete their own logs" on action_logs for delete
  using (user_id::text = current_setting('request.headers', true)::json->>'x-user-id');
