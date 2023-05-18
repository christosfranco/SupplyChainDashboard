const express = require('express');
const app = express();
const apiRoutes = require('./apis/apis');
app.use('/api',apiRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));


const { handleFilePost,handleFileGet,handleFileGetTest } = require('./controllers/parserController');

app.post('/filePost', handleFilePost);

app.get('/file', handleFileGet);
app.get('/fileTest', handleFileGetTest);

