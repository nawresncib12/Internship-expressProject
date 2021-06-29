const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

const app = express();

dotenv.config( { path : 'config.env'} )
const PORT = process.env.PORT || 8080

app.listen(PORT, ()=> { console.log(`http://localhost:${PORT}`)});