import { Router } from "express";
import { Game } from "../database/models";
const Games = Router();

// GET all games
Games.get("/", async (req, res) => {
  try {
    const games = await Game.findAll();
    res.status(200).send(games);

  } catch (err) {
    res.sendStatus(500);
  }
});

// GET specific game using game's id
Games.get("/:gameId", async (req, res) => {
  try {
    const game = await Game.findOne({ where: { id: req.params.gameId } });
    if (!game) {
      res.sendStatus(404);
    }
    res.status(200).send(game);
  } catch (err) {
    res.sendStatus(500);
  }
});

