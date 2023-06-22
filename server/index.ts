import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
// import { createServer } from "http";
import { createServer } from 'https';
import fs from 'fs';

import { ServerSocket } from './websocket/socket';
const { Users } = require("./routes/users");
//import { Games } from './routes/game';

dotenv.config();

const dist = path.resolve(__dirname, '..', 'client');
const app = express();
// const httpServer = createServer(app);

const options = {
  key: fs.readFileSync('localhost-key.pem'),
  cert: fs.readFileSync('localhost.pem')
};

const httpsServer = createServer(options, app);


// start the socket
// new ServerSocket(httpServer);
new ServerSocket(httpsServer);


const port = process.env.PORT || 3666;

app.use(express.json());
app.use(express.static(dist));
app.use(express.urlencoded({ extended: true }));

//server static files. will need to change for production.
app.use('/assets', express.static(path.join(__dirname, '..', '..', 'public/assets')))
app.use('/models', express.static(path.join(__dirname, '..', '..', 'public/models')))

app.use('/users', Users);
//app.use('/games', Games);


app.get('*', (req, res) => {
  res.sendFile(path.resolve(dist, 'index.html'), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});


// httpServer.listen(port, () => {
//   console.log(Server listening on port ${port});
// });

httpsServer.listen(port, () => {
  console.log(`Https server listening on port ${port}`);
});