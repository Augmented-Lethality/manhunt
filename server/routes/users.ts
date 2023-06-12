const { Router } = require('express');
const Users = Router();
const { User } = require('../database/models')

Users.get('/', (req, res) => {
  try {
    res.status(200).send('some data')
  } catch (err) {
    console.warn(err);
  }
});

module.exports = { Users };
