const { Router } = require('express');
const Users = Router();
const { User } = require('../database/models')

console.log('test3')

// GET ALL USERS
Users.get('/', async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.findAll();

    res.status(200).json(users);
  } catch (err) {
    console.warn(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET CURRENT USER
Users.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming you have access to the authenticated user's ID
    console.log(userId);
    // Fetch the user's data from the database based on their ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.warn(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST NEW USER
Users.post('/', async (req, res) => {
  try {
    const { username, email, sessionId, gameId, location, tfModelPath, gamesPlayed, gamesWon, killsConfirmed } = req.body;
    // Create a new user in the database
    const newUser = await User.create({
      username,
      email,
      sessionId,
      gameId,
      location,
      tfModelPath,
      gamesPlayed,
      gamesWon,
      killsConfirmed,
    });
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = { Users };
