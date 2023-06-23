import { Router } from "express";
import { Locations } from "../database/models";
export const Location = Router();

// GET all games
Location.get("/:gameId", async (req, res) => {

  try {
    const locations = await Locations.findAll({ where: { gameId: req.params.gameId } });
    res.status(200).send(locations);

  } catch (err) {
    res.sendStatus(500);
  }
});

module.exports = { Location };
