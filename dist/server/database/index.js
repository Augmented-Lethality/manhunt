"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const sequelize_1 = require("sequelize");
// Initialize DB
const db = new sequelize_1.Sequelize("Manhunt", "root", "", {
    host: "localhost",
    dialect: "mysql",
    logging: false, // Avoids printing all syncing messages in server 
});
exports.db = db;
// Sequelize Authenticate
db.sync({ alter: true }) // Syncs the database and models
    .then(() => {
    console.log("Tables synched.");
    db.authenticate();
})
    .then(() => {
    console.log("Connected to database.");
})
    .catch((err) => {
    console.error("Unable to connect to database:", err);
});
db.query("set foreign_key_checks = 0");
