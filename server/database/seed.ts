import { sequelize } from './index'; // Assuming this is the path to your app.ts file
import { User } from './models/User'; // Assuming User is a Sequelize model

const seedData = async () => {
  try {
    // Create seed data using Sequelize model methods
    await User.bulkCreate([
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' },
      // Add more seed data as needed
    ]);

    console.log('Seed data created successfully.');
  } catch (error) {
    console.error('Error creating seed data:', error);
  } finally {
    // Close the Sequelize connection
    await sequelize.close();
  }
};

seedData();




