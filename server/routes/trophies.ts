const Trophies = Router();
const { Trophy } = require("../database/models");

// GET ALL TROPHIES Of Specific User
Trophies.get("/", async (req, res) => {
  try {
    // Fetch all users from the database
    const Trophies = await Trophy.findAll();

    res.status(200).json(Trophies);
  } catch (err) {
    console.warn(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET SPECIFIC Trophy
Trophies.get("/:authId", async (req, res) => {
  try {
    const Trophy = await User.findOne({ where: { authId: req.params.authId } });
    if (!Trophy) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(Trophy);
  } catch (err) {
    console.warn(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST NEW USER, checks if user exists first, returns existing if so
Trophies.post("/", async (req, res) => {
  try {
    const {
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
    } = req.body;

    // Check if the user already exists
    const existingUser = await Trophy.findOne({ where: { authId } });

    if (existingUser) {
      // User already exists, return the existing user in the response
      res.status(200).json(existingUser);
    } else {
      // Else Create a new user in the database, return that new user.
      const newTrophy = await Trophy.create({
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
      res.status(201).json(newTrophy);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



module.exports = { Trophies };
