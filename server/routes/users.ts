const { Router } = require('express');
const Users = Router();
const { User } = require('../database/models')

console.log('test3')

Users.get('/', (req, res) => {
  try {
    res.status(200).send('some data')
  } catch (err) {
    console.warn(err);
  }
});

module.exports = { Users };
