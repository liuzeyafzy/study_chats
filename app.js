var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//Begin added for mongoose
var multer = require('multer');
var mongoose = require('mongoose');
var session = require('express-session');
//End added for mongoose

var routes = require('./routes/index');
var users = require('./routes/users');

//Begin added for mongoose
global.dbHandel = require('./database/dbHandel');
try{
    global.db = mongoose.connect("mongodb://localhost:27017/nodedb");
   // global.db = mongoose.connect("mongodb://nodedb:passwd@liuzeyafzy.com:27017/nodedb");
}catch(e){
    console.log('connect monbodb failed.');
}

//End added for mongoose
var app = express();
//Begin added for mongoose
// app.use(session({
//   secret: 'secret',
//   cookie:{
//     maxAge: 1000*60*30
//   },
//   resave: false,
//   saveUninitialized: true
// }));
app.use(session({
  secret: 'secret',
  cookie:{
    maxAge: 1000*60*30
  },
  resave: true,
  saveUninitialized: true
}));
//End added for mongoose

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//Begin added for mongoose
// app.use(multer());
//End added for mongoose
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Begin added for mongoose
app.use(function(req,res,next){
  res.locals.user = req.session.user;
  var err = req.session.error;
  delete req.session.error;
  res.locals.message = "";
  if(err){
    res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">'+err+'</div>';
  }
  next();
});
//End added for mongoose

app.use('/', routes);
app.use('/users', users);
//app.use(express.static('static'));
app.use('/error', function(req, res, next){
  res.status(err.status || 500).render('error', {
    message: '服务器内部错误',
    error: {}
  });
});

// error handlers
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  console.log('error: 404');
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500).render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
