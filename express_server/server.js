const express = require('express');
const app = express();
const apiRoutes = require('./apis/apis');
app.use('/api',apiRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
