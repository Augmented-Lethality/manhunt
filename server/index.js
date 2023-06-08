const express = require('express');
const path = require('path');

const dist = path.resolve(__dirname, '..', 'client', 'dist');
const app = express();
const port = process.env.PORT || 3666;

app.use(express.json()); // handles parsing content in the req.body from post/update requests
app.use(express.static(path.resolve(__dirname, '../client/dist')));
app.use(express.urlencoded({ extended: true })); // Parses url (allows arrays and objects)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(dist, 'index.html'), (err) => {
    if (err) {res.status(500).send(err);}
  })
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
