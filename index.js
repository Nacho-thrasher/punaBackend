require('dotenv').config();
const path = require('path');
const express = require('express'); 
const routes = require ('./route');
const morgan = require ('morgan');

const { dbConnection } = require('./src/database'); 
const cors = require('cors') 

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
//base de datos de
dbConnection();
app.use(express.static('public'));

app.use('/', routes);

app.use((err, req, res, next) => { 
    const status = err.status || 500;
    const message = err.message || err;
    console.error(err);
    res.status(status).send(message);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(process.env.PORT, () => {
    console.log('server on port', process.env.PORT);
})