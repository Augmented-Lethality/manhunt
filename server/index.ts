import express from 'express';
import * as path from 'path';

const app = express();
const port = process.env.PORT || 3666;

app.use(express.json()); // handles parsing content in the req.body from post/update requests
app.use(express.static(path.resolve(__dirname, '../client/dist')));
app.use(express.urlencoded({ extended: true })); // Parses url (allows arrays and objects)

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
