import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
//  import { createServer } from "http";
import { createServer } from 'https';
import fs from 'fs';

import { ServerSocket } from './websocket/socket';
const { Users } = require("./routes/users");
const { Trophies } = require('./routes/trophies');
import { Games } from './routes/game';
import { Location } from './routes/locations';
import { Friends } from './routes/friends'


dotenv.config();

const dist = path.resolve(__dirname, '..', 'client');
const app = express();

// HTTP SERVER
// const httpServer = createServer(app);

// HTTPS SERVER
const options = {
  key: fs.readFileSync('localhost-key.pem'),
  cert: fs.readFileSync('localhost.pem')
};
// HTTPS SERVER
const httpsServer = createServer(options, app);


// start the socket HTTP
// new ServerSocket(httpServer);
// start the socket HTTPS
new ServerSocket(httpsServer);


const port = process.env.PORT || 3666;

app.use(express.json());
app.use(express.static(dist));
app.use(express.urlencoded({ extended: true }));

//server static files. will need to change for production.
app.use('/textures', express.static(path.join(__dirname, '..', '..', 'public/textures')))
app.use('/models', express.static(path.join(__dirname, '..', '..', 'public/models')))

app.use('/users', Users);
app.use('/trophies', Trophies);
app.use('/games', Games);
app.use('/locations', Location);
app.use('/friends', Friends);


app.get('*', (req, res) => {
  res.sendFile(path.resolve(dist, 'index.html'), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

// HTTP SERVER
// httpServer.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });

// HTTPS SERVER
httpsServer.listen(port, () => {
  console.log(`Https server listening on port ${port}`);
});