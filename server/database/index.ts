import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('Manhunt', 'postgres', '5432', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');

    // Additional code and server initialization can go here
  })
  .catch((error: Error) => {
    console.error('Unable to connect to the database:', error);
  });

  export { sequelize };