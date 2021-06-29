const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./server/database/connection');
const app = express();

dotenv.config( { path : 'config.env'} )
const PORT = process.env.PORT || 8080

connectDB();

app.get('/',(req,res)=>{
    res.send("ElectroTN");
});

app.listen(PORT, ()=> { console.log(`http://localhost:${PORT}`)});