import express from 'express';
const { Router } = express;
const { Trophy } = require('../database/models');

const Trophies = Router();

// POST NEW Trophy
Trophies.post('/', async (req, res) => {
  try {
    const { name, description, generationConditions, filePath, ownerId } = req.body;
    console.log(name);
    const newTrophy = await Trophy.create({
      name,
      description,
      generationConditions,
      filePath,
      ownerId,
    });

    res.status(201).json(newTrophy);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




//THESE HAVNT BEEN TESTED
// // GET trophies Of Specific User
Trophies.get('/:ownerId', async (req, res) => {
  try {
    const { ownerId } = req.params;
    console.log(ownerId)
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

