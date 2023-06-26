const { Client } = require('pg');
const dotenv = require('dotenv'); 
dotenv.config();
//const { User } = require('./models')

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


// async function addTestUsers() {
//   try {
//     const users = [
//       {
//         "username": "Dummy Face",
//         "email": "bopbopbop.com",
//         "authId": "google-oauth2|112537847009419548967",
//         "gamesPlayed": 1002,
//         "gamesWon": 27,
//         "killsConfirmed": 27,
//       },
//       {
//         "username": "Slimmy J",
//         "email": "ddd.com",
//         "authId": "google-oauth2|112537847009419548968",
//         "gamesPlayed": 500000,
//         "gamesWon": 0,
//         "killsConfirmed": 0,
//       },
//       {
//         "username": "One More Dummy Face",
//         "email": "bopbopbop.com",
//         "authId": "google-oauth2|112537847009419548969",
//         "gamesPlayed": 100,
//         "gamesWon": 100,
//         "killsConfirmed": 100,
//       }
//     ];

//     await User.bulkCreate(users);

//     console.log('Users seeded successfully!');
//   } catch (err) {
//     console.error('Error seeding users:', err);
//   } finally {
//     await User.sequelize.close();
//   }
// }


// addTestUsers();
setupDatabase();
