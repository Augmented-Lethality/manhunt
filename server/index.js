const express = require('express');

const app = express();

const port = process.env.PORT || 3666;

app.get('/', (req, res) => {
  res.status(200).send('Hi Man Hunters');
});

app.listen(port, () => {
  console.log(`Server listening on port ${ port }`);
})

