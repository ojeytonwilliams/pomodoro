var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var validator = require('validator');
var compression = require('compression');
var helmet = require('helmet');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// TODO: Perhaps replace this with nconf.  Either way,
// this needs to work on dev and production without
// any secrets being made public!
var config = require('./config.json');
//var api = require('./routes/api');

var app = express();

app.use(helmet());
app.use(compression()); //Compress all routes

//Set up mongoose connection
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(expressValidator());
app.use(expressValidator({
 customSanitizers: {
    toISO8601: function(date) {
        var newDate = validator.toDate(date).toISOString();
        return newDate;
    },
 }
}));
app.use(require('express-session')({
    secret: config.session_secret,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
//app.use(express.static(path.join(__dirname, 'public')));


//app.use('/', routes);


// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

//app.use('/api', api);

var mongoDB = 'mongodb://localhost/pomodoro';
mongoose.connect(mongoDB, {promiseLibrary: mongoose.Promise});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
