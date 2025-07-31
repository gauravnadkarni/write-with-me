CREATE OR REPLACE FUNCTION public.deduct_credit(
  user_id TEXT,
  deduction_amount INTEGER  -- Match this with your column type
)
RETURNS TABLE (success BOOLEAN, remaining_credit INTEGER)  -- Changed to INTEGER
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  RETURN QUERY
  WITH credit_check AS (
    SELECT "requestCount" AS current_credit
    FROM "Usage"
    WHERE "userId" = deduct_credit.user_id
    FOR UPDATE
  ),
  update_credit AS (
    UPDATE "Usage"
    SET "requestCount" = "requestCount" - deduction_amount
    WHERE "userId" = deduct_credit.user_id
      AND EXISTS (SELECT 1 FROM credit_check WHERE current_credit >= deduction_amount)
    RETURNING "requestCount"
  )
  SELECT 
    CASE 
      WHEN (SELECT count(*) FROM update_credit) > 0 THEN true 
      ELSE false 
    END,
    COALESCE(
      (SELECT "requestCount" FROM update_credit), 
      (SELECT current_credit FROM credit_check), 
      0
    );
END;
$$;