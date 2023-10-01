import { Pool } from 'pg';
import { config } from 'dotenv';

config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
});

const execQuery = async (text: string, params: any[] = []) => {
  const result = await pool.query(text, params);

  return result.rows;
};

const execQueryOne = async (text: string, params: any[] = []) => {
  const result = await pool.query(text, params);

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};

const execCount = async (text: string, params: any[] = []) => {
  const result = await pool.query(text, params);

  return parseInt(result.rows[0].count);
};

export { execQuery, execQueryOne, execCount };
