const express = require('express');
const app = express();
const apiRoutes = require('./apis/apis');
app.use('/api',apiRoutes);

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
