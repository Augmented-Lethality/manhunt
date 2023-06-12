const { Client } = require('pg');

// Create a new client instance
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  password: '',
  port: 5432,
});

async function setupDatabase() {
  try {
    await client.connect();

    // Drop the database if it exists
    await client.query('DROP DATABASE IF EXISTS manhunt');

    // Create the database
    await client.query('CREATE DATABASE manhunt');

    console.log('Database setup complete.');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    // Make sure to always close the client
    await client.end();
  }
}

setupDatabase();

