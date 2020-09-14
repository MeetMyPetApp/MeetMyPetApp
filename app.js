require('dotenv').config();
const express = require('express');
const logger = require("morgan");
const path = require("path");
const cookieParser = require('cookie-parser')

require('./config/db.config')
require('./config/hbs.config');
/* require('./bin/seeds'); */

const passport = require('./config/passport.config');
const session = require('./config/session.config');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(cookieParser())
app.use(session)
app.use(passport)


const router = require('./config/routes.js');
app.use('/', router);

app.listen(process.env.PORT || 3000, () => {
  console.log('Ready!!!');
});