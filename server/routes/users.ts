const { Router } = require("express");
const Users = Router();
const { User } = require("../database/models");

// GET ALL USERS
Users.get("/", async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.findAll();

    res.status(200).json(users);
  } catch (err) {
    console.warn(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET SPECIFIC USER
Users.get("/:authId", async (req, res) => {
  try {
    // Fetch the user's data from the database based on their google auth ID
    const user = await User.findOne({ where: { authId: req.params.authId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.warn(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST NEW USER, checks if user exists first, returns existing if so
Users.post("/", async (req, res) => {
  try {
    const {
      username,
      email,
      authId,
      gameId,
      location,
      tfModelPath,
      gamesPlayed,
      gamesWon,
      killsConfirmed,
    } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { authId } });

    if (existingUser) {
      // User already exists, return the existing user in the response
      res.status(200).json(existingUser);
    } else {
      // Else Create a new user in the database, return that new user.
      const newUser = await User.create({
        username,
        email,
        authId,
        gameId,
        location,
        tfModelPath,
        gamesPlayed,
        gamesWon,
        killsConfirmed,
      });
      res.status(201).json(newUser);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// PUT updated stats into user
Users.put("/:authId", async (req, res) => {
  try {
    const authId = req.params.authId;
    const { gamesPlayed, gamesWon, killsConfirmed } = req.body;

    // Find the user with the specified authId
    const user = await User.findOne({ where: { authId } });

    if (!user) {
      // If no user was found with the specified authId
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's data in the database
    user.gamesPlayed = gamesPlayed;
    user.gamesWon = gamesWon;
    user.killsConfirmed = killsConfirmed;

    await user.save(); // Save the updated user object

    // Return the updated user object in the response
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PATCH face-descriptions into user
Users.patch("/face-description/:authId", async (req, res) => {
  try {
    const user = await User.findOne({ where: { authId: req.params.authId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.facialDescriptions = req.body.descriptions;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = { Users };
