var express = require('express');
var router = express.Router();
var path = require('path');
const fs = require('fs');
var config = require(path.join(process.cwd(), 'config', 'config'));
var rmdir = require('rmdir');

//article全路径遍历
router.delete('*', function(req, res, next){
    var paths = req.path;
    paths = decodeURI(paths);
    var totalPath = path.join(config.get('articlePath'), paths);
    //TODO暂时的条件为注册用户才能删除，后面要修改为有权限的用户才能删除
    if(req.session.user){
        console.log('user');
        if(true === fs.statSync(totalPath).isFile()){
            fs.unlink(totalPath, (err) => {
                if (err) throw err;
                console.log('successfully deleted' + totalPath);
                res.send({msg:'删除成功',code: 0});
            });
        }else if(true === fs.statSync(totalPath).isDirectory()){
            //递归删除的方法，能删除非空文件夹
            rmdir(totalPath, (err) => {
                if (err) throw err;
                console.log('successfully deleted' + totalPath);
                res.send({msg:'删除成功',code: 0});
            });
        }
    }else{
        console.log('no user');
        res.status(501);
        res.send({msg:'无删除权限',code: 501});
    }
});

router.get('*',function(req, res, next){
    var paths = req.path;
    paths = decodeURI(paths);
    var totalPath = path.join(config.get('articlePath'), paths);
    if(true === fs.statSync(totalPath).isFile()){
        if('/download' === req.baseUrl){
            res.download(totalPath);
        }else if('/article' === req.baseUrl){
            //读取文件
            fs.readFile(totalPath, function (err,data){
                res.contentType(express.static.mime.lookup(totalPath));
                res.send(data);
            });
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
        var subdir = paths.slice(0, tmpN);
        res.render('article/article', {
            subdir: path.join('/article',subdir),
            dir: path.join('/article',paths),
            paths: obj
        });
    }else{
        res.send('并没有找到所要的文件');
    }
});

router.put('*', function(req, res, next){
    //TODO:这里需要增加一个判断，只有已登录用户才能操作，未登录用户回到登录页面
    var paths = req.path;
    paths = decodeURI(paths);
    var totalPath = path.join(config.get('articlePath'), paths);
    req.on('data', function(c){
        // console.log('C: %j', c );
        //fs.WriteStream('host.txt', c);
        fs.appendFile(totalPath, c);
        console.log('Write data OK.');
    }).on('end', function(){
        res.status(200).send({msg:'操作成功',code: 0});
    });

});

router.use(function(req, res, next) {
    res.send('并没有找到所要的文件');
});

module.exports = router;
