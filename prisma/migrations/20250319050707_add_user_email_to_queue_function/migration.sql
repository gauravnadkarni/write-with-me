CREATE OR REPLACE FUNCTION send_welcome_email()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO "Emails" ("id", "userId", "email","updated_at")
  VALUES (gen_random_uuid(), NEW.id, NEW.email, NOW());
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_user_signup
AFTER INSERT ON "Users"
FOR EACH ROW
EXECUTE FUNCTION send_welcome_email();
