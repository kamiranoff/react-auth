// Starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();

const router = require('./router');

//DB setup
mongoose.connect('mongodb://localhost:auth/reactauth');


//App Setup - Middlewares
app.use(morgan('combined'));
app.use(bodyParser.json({type:'*/*'}));
router(app);

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port);