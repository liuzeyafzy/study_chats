var express = require('express');
var session = require('express-session');
var swig = require('swig');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express = require('express');
var multer = require('multer');

var mongoose = require('mongoose');
var router = require('./routes/router');
const config = require(path.join(process.cwd(), 'config', 'config'));

var app = express();

app.use(session({
  secret: 'secret',
  cookie:{
    maxAge: 1000*60*30
  },
  resave: false,
  saveUninitialized: true
}));

// view engine setup
swig.setDefaults({ loader: swig.loaders.fs(__dirname + '/views/templates') });
app.set('views', path.join(process.cwd(), 'views'));
// app.set('view engine', 'jade');
// app.set('view engine', 'ejs');
app.engine('html', swig.renderFile)
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(favicon(path.join(process.cwd(), '/public/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//Begin added for mongoose
// app.use(multer());
//End added for mongoose
app.use(cookieParser());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(function(req, res, next){
    //中间件，非外部域名不加载mongodb
    if (config.get('hostnameRegExp').test(req.hostname)) {
        global.dbHandel = require('./database/dbHandel');
        try{
            global.db = mongoose.connect("mongodb://localhost:27017/nodedb");
        }catch(e){
            console.log('connect monbodb failed.');
        }
    }

    next();
})

//路由处理文件
router.init(app);

module.exports = app;
