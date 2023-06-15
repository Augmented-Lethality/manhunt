const { Client } = require('pg');
const dotenv = require('dotenv'); 
dotenv.config();

// Create a new client instance
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
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



