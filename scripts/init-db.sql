-- Створення користувача та бази даних для AKSI Dry Cleaning System

-- Створюємо користувача (якщо не існує)
DO
$do$
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'aksi_user') THEN
      CREATE USER aksi_user WITH PASSWORD '1111';
   END IF;
END
$do$;

-- Створюємо базу даних (якщо не існує)
SELECT 'CREATE DATABASE aksi_dry_cleaning OWNER aksi_user'
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'aksi_dry_cleaning')\gexec

-- Надаємо права користувачу
GRANT ALL PRIVILEGES ON DATABASE aksi_dry_cleaning TO aksi_user;

-- Підключаємося до нової БД та надаємо права на схему
\c aksi_dry_cleaning

-- Надаємо права на схему public
GRANT USAGE ON SCHEMA public TO aksi_user;
GRANT CREATE ON SCHEMA public TO aksi_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO aksi_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO aksi_user;

-- Встановлюємо права за замовчуванням для майбутніх об'єктів
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO aksi_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO aksi_user;
