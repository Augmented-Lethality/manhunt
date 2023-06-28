import { Router } from "express";
import { Game, User } from "../database/models";
export const Games = Router();

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
// Games.get("/:gameId", async (req, res) => {
//   try {
//     const game = await Game.findOne({ where: { gameId: req.params.gameId } });
//     if (!game) {
//       res.sendStatus(404);
//     } else {
//       res.status(200).send(game);
//     }
//   } catch (err) {
//     res.sendStatus(500);
//   }
// });

// GET games using user's authId
Games.get("/user/:authId", async (req, res) => {
  try {
    const user = await User.findOne({ where: { authId: req.params.authId } });

    if (user) {
      const game = await Game.findAll({ where: { gameId: user.dataValues.gameId } });
      if (!game) {
        res.sendStatus(404);
      } else {
        res.status(200).send(game);
      }
    } else {
      res.sendStatus(404);
    }

  } catch (err) {
    res.sendStatus(500);
  }
});

// POST new game
Games.post("/", async (req, res) => {
  const { id, host } = req.body;

  try {
    // game already exists?
    const exists = await Game.findOne({ where: { id } });

    if (exists) {
      res.status(200).send(exists);
    } else {

      const game = await Game.create({ id, host, status: 'lobby' });
      res.status(201).send(game);

    }
  } catch (err) {
    res.sendStatus(500);
  }
});

module.exports = { Games };
