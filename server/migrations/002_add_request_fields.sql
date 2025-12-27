ALTER TABLE maintenance_requests
ADD COLUMN IF NOT EXISTS title TEXT;

ALTER TABLE maintenance_requests
ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE maintenance_requests
ADD COLUMN IF NOT EXISTS priority VARCHAR(10) DEFAULT 'MEDIUM';

-- Ensure NOT NULL on title (after it exists)
UPDATE maintenance_requests SET title = 'Maintenance request' WHERE title IS NULL;
ALTER TABLE maintenance_requests ALTER COLUMN title SET NOT NULL;