require('dotenv').config();
const express = require('express');
const logger = require("morgan");
const path = require("path");
const cookieParser = require('cookie-parser')

require('./config/db.config')
require('./config/hbs.config');

const passport = require('./config/passport.config');
const session = require('./config/session.config');


const Handlebars = require('handlebars');

Handlebars.registerHelper('ifeq', function (a, b, options) {
    if (a == b) { return options.fn(this); }
    return options.inverse(this);
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(cookieParser())
app.use(session)
app.use(passport)


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


const router = require('./config/routes.js');
app.use('/', router);

app.listen(process.env.PORT || 3000, () => {
  console.log('Ready!');
});