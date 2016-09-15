'use strict';

const app = require('express')();
const config = require('./config');
const errorHandler = require('./middleware/error');
const bodyParser = require('body-parser');
const middleware = require('./middleware');
const routes = require('./routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(middleware.addHeaders);
app.use('/', routes);

app.use(middleware.catch404);
app.use(errorHandler({env: config.env}));

module.exports = app;
