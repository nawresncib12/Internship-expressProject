const express = require('express');
const dotenv = require('dotenv');
const helmet=require('helmet');
const path = require('path');
const connectDB = require('./server/database/connection');
const app = express();

dotenv.config({ path: 'config.env' })
if(!process.env.ETJWTPRIVATEKEY){
  console.error('FATAL ERROR : jwtPrivateKey is not defined.')
  process.exit(1);
}
app.use(helmet());

const PORT = process.env.PORT || 8080

connectDB();

app.get('/', (req, res) => {
    res.send("ElectroTN");
});

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));


app.use('/', require('./server/router/route'));

app.listen(PORT, () => { console.log(`http://localhost:${PORT}`) });