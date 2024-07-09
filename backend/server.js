const express = require('express');

const app = express();

const PORT = 5000;

app.get('/', (req, res) => res.json({msg: 'Hello World!'}));

app.listen(PORT, console.log(`Backend is running on port: ${PORT}`));