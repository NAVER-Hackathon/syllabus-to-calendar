-- Add file_content column to syllabus_uploads table
-- This allows files to persist across serverless function invocations

ALTER TABLE syllabus_uploads 
ADD COLUMN file_content LONGBLOB AFTER file_size;

-- Note: LONGBLOB can store up to 4GB
-- If you need smaller files, use MEDIUMBLOB (16MB) or BLOB (64KB)

