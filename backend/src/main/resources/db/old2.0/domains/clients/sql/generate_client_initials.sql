CREATE OR REPLACE FUNCTION generate_client_initials(first_name varchar, last_name varchar) 
RETURNS varchar AS $$
DECLARE
    initials varchar;
BEGIN
    initials := '';
    
    IF first_name IS NOT NULL AND first_name != '' THEN
        initials := initials || UPPER(SUBSTRING(first_name, 1, 1));
    END IF;
    
    IF last_name IS NOT NULL AND last_name != '' THEN
        initials := initials || UPPER(SUBSTRING(last_name, 1, 1));
    END IF;
    
    RETURN initials;
END;
$$ LANGUAGE plpgsql;
