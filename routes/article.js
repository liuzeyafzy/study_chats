var express = require('express');
var router = express.Router();
var path = require('path');
const fs = require('fs');
var config = require(path.join(process.cwd(), 'config', 'config'));

/* GET users listing. */
router.get('/', function(req, res, next) {
  getFileFromPaths(req, res, next, '');
});

// router.param('paths', function (req, res, next, paths) {
//     getFileFromPaths(req, res, next, paths);
// });
// router.get('/:paths', function(req, res, next){
//     next();
// })

//article全路径遍历
router.use(function(req, res, next) {
    getFileFromPaths(req, res, next, req.path);
});

function getFileFromPaths(req, res, next, paths){
    // console.log(req.session);
    // console.log(req.baseUrl);
    paths = decodeURI(paths);
    var totalPath = path.join(config.get('articlePath'), paths);
    if(true === fs.statSync(totalPath).isFile()){
        if('/download' === req.baseUrl){
            res.download(totalPath);
        }else if('/article' === req.baseUrl){
            console.log(req.method.toLowerCase());
            if('delete' === req.method.toLowerCase()){
                // if(req.session.user){//暂时的条件为注册用户才能删除
                if(true){
                    console.log('user');
                    fs.unlink(totalPath, (err) => {
                        if (err) throw err;
                        console.log('successfully deleted' + totalPath);
                        // var tmpN = paths.lastIndexOf('/');
                        // var dir = paths.slice(0, tmpN);
                        res.send({msg:'删除成功',code: 0});
                        // res.redirect(path.join('/article',dir));
                    });
                }else{
                    res.status = 500;
                    res.send({msg:'无删除权限',code: 501});
                }
            }else{
                fs.readFile(totalPath, function (err,data){
                    res.contentType(express.static.mime.lookup(totalPath))
                    res.send(data);
                });
            }
        }else{
            console.log(req.baseUrl);
        }
    }else if(true === fs.statSync(totalPath).isDirectory()){
        var addr = fs.readdirSync(totalPath);

        var obj = [];
        for(var i = 0, len = addr.length; i < len; i++){
            obj.push({
                name: addr[i],
                viewUrl: path.join('/article', paths, addr[i]),
                downloadUrl: path.join('/download', paths, addr[i]),
                isFile: fs.statSync(path.join(totalPath, addr[i])).isFile()
            });
        }

        var tmpN = paths.lastIndexOf('/');
        var dir = paths.slice(0, tmpN);
        res.render('article/article', {
            dir: path.join('/article',dir),
            paths: obj
        });
    }else{
        res.send('并没有找到所要的文件');
        // res.send(req.hostname);
    }
}

module.exports = router;
