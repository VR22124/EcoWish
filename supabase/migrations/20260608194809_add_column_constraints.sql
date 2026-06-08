-- Add data integrity constraints to action_logs table

-- Enforce positive carbon savings
alter table action_logs
  add constraint action_logs_carbon_saved_positive
  check (carbon_saved_kg > 0);

-- Enforce maximum lengths to prevent oversized payloads
alter table action_logs
  add constraint action_logs_action_title_length
  check (char_length(action_title) between 1 and 255);

alter table action_logs
  add constraint action_logs_category_length
  check (char_length(category) between 1 and 100);
