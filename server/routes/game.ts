const Game = Router();
const { Game: gameModel } = require("../database/models");

// GET ALL USERS
Game.post("/face-description", async (req, res) => {
  try {
    const {label, descriptor} = req.body;
    // put values into current game
    await Game.create({label, descriptor});
    res.status(201);
} catch (err) {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
}
});