var express = require('express');
var router = express.Router();
var path = require('path');
const fs = require('fs');
var config = require(path.join(process.cwd(), 'config', 'config'));

/* GET users listing. */
router.get('/', function(req, res, next) {
  // var addr = fs.readdirSync(__dirname);
  var addr = fs.readdirSync(config.get('articlePath'));

  res.send(addr);
});

//article路由未找到匹配的情况
router.use(function(req, res, next) {
  res.send('并没有找到所要的文件');
  // res.send(req.hostname);
});

module.exports = router;
