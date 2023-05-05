const express = require('express');
const app = express();

app.get('/api/request_data', (req, res) => {
  // Handle GET request here
  const data = [
    { concern1: 'bleh'},
    { concern2: 'bli'}
  ];
  res.send(data);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
