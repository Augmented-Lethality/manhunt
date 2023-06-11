import { Sequelize } from 'sequelize';

// parameters are db, user, and password
const db = new Sequelize('manhunt', 'postgres', '', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: false, // Avoids printing all syncing messages in server
});

// Sequelize Authenticate
db.sync({alter: true})  // Syncs the database and models
  .then(() => {
    console.log("Tables synched.");
    db.authenticate()
  })
  .then(() => {
    console.log("Connected to database.");
  })
  .catch((err) => {
    console.error("Unable to connect to database:", err);
  });

  db.query("set foreign_key_checks = 0");

  module.exports = { db };
