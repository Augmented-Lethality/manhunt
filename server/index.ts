import express from 'express';
import * as path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3666;

app.use(express.json()); // handles parsing content in the req.body from post/update requests
app.use(express.static(path.resolve(__dirname, '../client/dist'))); // serves static file from client side in dist, created by webpack
app.use(express.urlencoded({ extended: true })); // parses url (allows arrays and objects)

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
