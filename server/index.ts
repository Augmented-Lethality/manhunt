import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const dist = path.resolve(__dirname, '..', 'dist', 'client');
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });
const port = process.env.PORT || 3666;

app.use(express.json());
app.use(express.static(dist));
app.use(express.urlencoded({ extended: true }));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(dist, 'index.html'), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

io.on("connection", (socket) => {
  // ...
});

httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
