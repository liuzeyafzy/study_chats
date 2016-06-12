/* 配置文件
 * Author: liuzeyafzy
 */
const path = require('path');

const config = {
    'hostnameRegExp': /liuzeyafzy.com$/,
    'homePath': process.cwd(),
    'articlePath': path.join(process.cwd(), 'article')
}

module.exports = {
    get: function(name, def){
        if(config.hasOwnProperty(name)){
            return config[name];
        }else{
            if(undefined !== def){
                return def;
            }
            return '';
        }
    }
};
