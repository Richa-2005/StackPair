-- Add missing foreign key columns
ALTER TABLE maintenance_requests
ADD COLUMN IF NOT EXISTS maintenance_team_id INT;

ALTER TABLE maintenance_requests
ADD COLUMN IF NOT EXISTS created_by_user_id INT;

ALTER TABLE maintenance_requests
ADD COLUMN IF NOT EXISTS assigned_to_user_id INT;

-- Add foreign key constraints (safe)
ALTER TABLE maintenance_requests
ADD CONSTRAINT fk_requests_team
FOREIGN KEY (maintenance_team_id) REFERENCES teams(id)
ON DELETE SET NULL;

ALTER TABLE maintenance_requests
ADD CONSTRAINT fk_requests_created_by
FOREIGN KEY (created_by_user_id) REFERENCES users(id)
ON DELETE SET NULL;

ALTER TABLE maintenance_requests
ADD CONSTRAINT fk_requests_assigned_to
FOREIGN KEY (assigned_to_user_id) REFERENCES users(id)
ON DELETE SET NULL;