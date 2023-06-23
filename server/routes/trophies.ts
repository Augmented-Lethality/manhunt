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

module.exports = { Trophies };



//THESE HAVNT BEEN TESTED
// // GET ALL TROPHIES Of Specific User
Trophies.get('/:ownerId', async (req, res) => {
  try {
    const { ownerId } = req.params;
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



// GET  Trophy
Trophies.get("/", async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await Trophy.findAll();

    res.status(200).json(Trophies);
  } catch (err) {
    console.warn(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
