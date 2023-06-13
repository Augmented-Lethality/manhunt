const { Router } = require('express');
const Users = Router();
const { User } = require('../database/models')

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


// GET SPECIFIC USER
Users.get('/:authId', async (req, res) => {
  try {
    const authId = req.params.authId; // Assuming you have access to the authenticated user's ID
    console.log('authId:', authId);
    console.log('req.params.authId:', req.params.authId);
    
    // Fetch the user's data from the database based on their google auth ID
    const user = await User.findOne({ where: { authId: req.params.authId } });

    console.log('User:', user);

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
    const { username, email, authId, sessionId, gameId, location, tfModelPath, gamesPlayed, gamesWon, killsConfirmed } = req.body;
    // Create a new user in the database
    const newUser = await User.create({
      username,
      email,
      authId,
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
