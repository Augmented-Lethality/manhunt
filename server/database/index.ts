import { Sequelize } from "sequelize";

// Initialize DB
const db = new Sequelize("Manhunt", "root", "", {
  host: "localhost", // `host` parameter required for other databases
  dialect: "mysql",
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


export {
  db,
};

