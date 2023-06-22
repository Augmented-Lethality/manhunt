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
// Trophies.get('/', async (req, res) => {
//   try {
//     // Fetch all users from the database
//     const Trophies = await Trophy.findAll();

//     res.status(200).json(Trophies);
//   } catch (err) {
//     console.warn(err);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// // GET SPECIFIC Trophy
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
