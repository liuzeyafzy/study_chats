/* 主路由文件，所有路由均通过此处
 * Author: liuzeyafzy
 */
var index = require('./index');
var users = require('./users');
var article = require('./article');

module.exports = {
    init: function(app){
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

        app.use('/', index);
        app.use('/article', article);
        app.use('/users', users);
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
    }

}
