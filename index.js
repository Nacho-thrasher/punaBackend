require('dotenv').config();
const path = require('path');
const express = require('express'); 
const routes = require ('./route');
const morgan = require ('morgan');

const { dbConnection } = require('./src/database'); 
const cors = require('cors') 
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}


const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

dbConnection();
app.use(express.static('public'));

app.use('/', routes);

app.use((err, req, res, next) => { 
    const status = err.status || 500;
    const message = err.message || err;
    res.status(status).send(message);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(process.env.PORT, () => {
    console.log('server on port', process.env.PORT);
})