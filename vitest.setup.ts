import { config as dotenv } from 'dotenv';
// Load .env if present
dotenv({ path: '.env' });

// Provide default secrets for tests if not set
process.env.JWT_ACCESS_SECRET ||= 'test-access-secret';
process.env.JWT_REFRESH_SECRET ||= 'test-refresh-secret';
process.env.NODE_ENV ||= 'test';
