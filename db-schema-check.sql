-- Check the structure of the certifications table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'certifications' 
ORDER BY ordinal_position;
