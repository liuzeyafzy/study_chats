var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});
router.post('/login', function(req, res, next) {
  var User = global.dbHandel.getModel('user');
  var uname = req.body.username;
  var password = req.body.password;
  User.findOne({name: uname}, function(err, doc){
    if(err){
      res.status(500);
      res.send('服务器内部错误！');
      console.log(err);
    }else if(!doc){
      req.session.error = '用户名不存在';
      res.status(404);
      res.send('用户名不存在');
    }else{
      console.log(doc.password);
      if(!bcrypt.compareSync(password, doc.password)){
      //if(password != doc.password){
        req.session.error = '密码错误';
        res.status(404);
        res.send('密码错误');
      }else{
        req.session.user = doc;
        res.sendStatus(200);
        //res.redirect('/home');
      }
    }
  });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});
router.post('/register', function(req, res, next) {
  //res.send({ title: 'Register' });
  var User = global.dbHandel.getModel('user');
  var uname = req.body.username;
  var password = req.body.password;
  User.findOne({name:uname}, function(err, doc){
    if(err){
      res.send(500);
      res.session.error = '网络异常错误';
      console.log(err);
    }else if(doc){
      req.session.error = '用户名已存在';
      res.send(500);
    }else{
      var salt = bcrypt.genSaltSync();
      User.create({
        name: uname,
        password: bcrypt.hashSync(password, salt)
      }, function(err, doc){
        if(err){
          res.send(500);
          console.log(err);
        }else{
          req.session.error = '用户名创建成功！';
          res.status = 200;
          res.send('用户名创建成功！');
        }
      });
    }
  });
});

router.get('/home', function(req, res, next){
  if(!req.session.user){
    req.session.error = '请先登录';
    res.redirect('/login');
  }else{
    res.render('home', {title: 'Home', user: req.session.user.name})
  }
});

router.get('/chat001', function(req, res, next){
  if(!req.session.user){
    req.session.error = '请先登录';
    res.redirect('/login');
  }else{
    res.render('chat', {title: 'chat0001', user: req.session.user.name});
  }
});
router.get('/chat002', function(req, res, next){
  if(!req.session.user){
    req.session.error = '请先登录';
    res.redirect('/login');
  }else{
    console.log(path.join(__dirname, '/../views/chat002.html'));
    res.sendFile(path.join(__dirname + '/../views/chat002.html'));
  }
});

router.get('/logout', function(req, res){
  req.session.user = null;
  req.session.error = null;
  res.redirect('/');
});

module.exports = router;
