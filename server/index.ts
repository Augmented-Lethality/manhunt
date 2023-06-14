import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer } from "http";

import { ServerSocket } from './websocket/socket';
const { sequelize } = require("./database/index");
const { Users } = require("./routes/users");

dotenv.config();

const dist = path.resolve(__dirname, '..', 'client');
const app = express();
const httpServer = createServer(app);

// start the socket
new ServerSocket(httpServer);

const port = process.env.PORT || 3666;

app.use(express.json());
app.use(express.static(dist));
app.use(express.urlencoded({ extended: true }));

app.use('/users', Users);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(dist, 'index.html'), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});


httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
