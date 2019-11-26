const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('cookie-session');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const restaurantApiRouter = require('./routes/restaurant_api');
const userRouter = require('./routes/user.controller');
const restaurantRouter = require('./routes/restaurant');

const { getDb } = require('./models/database');

const app = express();
app.use(
  session({
    name: 'session',
    keys: ['key1', 'key2'],
  }),
);
app.use((req, res, next) => {
  req.db = getDb();
  next();
});
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
// app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/restaurant', restaurantRouter);
app.use('/api/restaurant', restaurantApiRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
