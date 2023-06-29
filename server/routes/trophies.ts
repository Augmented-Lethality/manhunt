import express from 'express';
const { Router } = express;
const { Trophy } = require('../database/models');

const Trophies = Router();

// POST NEW Trophy
Trophies.post('/', async (req, res) => {
  try {
    const { name, description, generationConditions, filePath, ownerId } =
      req.body;
    const newTrophy = await Trophy.create({
      name,
      description,
      generationConditions,
      filePath,
      ownerId,
    });
    res.status(201).json(newTrophy);
    console.log(name, 'saved successfully');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// // GET trophies Of Specific User
Trophies.get('/:ownerId', async (req, res) => {
  try {
    const { ownerId } = req.params;
    console.log('got all trophies for user with Id:', ownerId);
    // Fetch all trophies associated with the provided authId
    const userTrophies = await Trophy.findAll({
      where: { ownerId: ownerId },
    });

    res.status(200).json(userTrophies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = { Trophies };
