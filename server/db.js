const mysql = require('mysql2/promise');

const requiredEnv = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_NAME'];

function assertDatabaseEnv() {
  const missing = requiredEnv.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(`Missing database environment variables: ${missing.join(', ')}`);
  }
}

function createPool() {
  assertDatabaseEnv();

  return mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
  });
}

module.exports = {
  createPool,
};
