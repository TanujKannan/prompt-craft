-- Create rate_limits table for API rate limiting
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_created 
ON rate_limits (identifier, created_at);

CREATE INDEX IF NOT EXISTS idx_rate_limits_created_at 
ON rate_limits (created_at);

-- Enable RLS (though we'll use service role key to bypass it)
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Add a policy for service role access (optional, since we use service role key)
CREATE POLICY "Service role can manage rate limits" ON rate_limits
  FOR ALL USING (auth.role() = 'service_role');

-- Add automatic cleanup function (optional, can be done via cron job)
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM rate_limits 
  WHERE created_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- Note: You can set up a cron job to run this function periodically:
-- SELECT cron.schedule('cleanup-rate-limits', '*/30 * * * *', 'SELECT cleanup_old_rate_limits();'); 