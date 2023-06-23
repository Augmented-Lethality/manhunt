import { Router } from "express";
import { Locations, User } from "../database/models";
export const Location = Router();

// GET all games
Location.get("/:authId", async (req, res) => {
  try {
    const user = await User.findOne({ where: { authId: req.params.authId } });

    if (user) {
      const locations = await Locations.findAll({ where: { gameId: user.dataValues.gameId } });

      if (!locations) {
        res.sendStatus(404);
      } else {
        res.status(200).send(locations);
      }
    } else {
      res.sendStatus(404);
    }

  } catch (err) {
    res.sendStatus(500);
  }

});

module.exports = { Location };
