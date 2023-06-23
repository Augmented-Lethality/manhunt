import express from 'express';
const { Router } = express;
const { Trophy } = require('../database/models');

const Trophies = Router();

// POST NEW Trophy
Trophies.post('/', async (req, res) => {
  try {
    const { name, description, generationConditions, filePath, ownersId } = req.body;
    console.log(name);
    const newTrophy = await Trophy.create({
      name,
      description,
      generationConditions,
      filePath,
      ownersId,
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
Trophies.get('/:authId', async (req, res) => {
  try {
    const { authId } = req.params;

    // Fetch all trophies associated with the provided authId
    const userTrophies = await Trophy.findAll({
      where: { ownersId: authId },
    });

    res.status(200).json(userTrophies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// // GET  Trophy
// Trophies.get('/:authId', async (req, res) => {
//   try {
//     const Trophy = await User.findOne({ where: { authId: req.params.authId } });
//     if (!Trophy) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     res.status(200).json(Trophy);
//   } catch (err) {
//     console.warn(err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });
