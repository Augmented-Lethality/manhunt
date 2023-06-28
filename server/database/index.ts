import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize('manhunt', process.env.DB_USER!, process.env.DB_PASSWORD!, {
  host: process.env.DB_HOST!,
  port: 5432,
  dialect: 'postgres',
  // dialectOptions: {   // NEED THIS FOR DEPLOYMENT, DO NOT REMOVE
  //   ssl: {
  //     require: true,
  //     rejectUnauthorized: false,
  //   }
  // },
  logging: false, // Avoids printing all syncing messages in server
});

sequelize.sync({ alter: true }) // Syncs the database and models
  .then(() => {
    return sequelize.authenticate();
  })
  .then(() => {
    console.log("Connected to the database.");
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

export default sequelize;
