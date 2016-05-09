var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('html/bootstrap');
});

module.exports = router;
