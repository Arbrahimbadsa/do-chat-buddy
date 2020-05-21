const express = require('express');
const app = express();
const mongoose = require('mongoose');
const assert = require('assert');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());


// mongoose connection

const URL = require('./config/url');

mongoose.connect(URL, {useUnifiedTopology: true, useNewUrlParser: true});

const db = mongoose.connection;

// handle error
db.on('error', (err) => console.log(err));

// connection successfulld
db.once('open', () => {
    console.log('Conncection successfull');
});

if (process.env.NODE_ENV) {
    app.use(express.static('client/build'));
    app.get('*', (res, req) => {
        res.sendFile(paht.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log('Sever created successfully'));
const io = require('socket.io')(server);

io.on('connection', (socket) => {
    socket.on('message', (msg) => {
        socket.broadcast.emit('fromServer', msg);
    });
});

const router = require('./routers/router');

app.use(router);