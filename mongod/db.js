const mongoose = require('mongoose')
//这句话说明我们使用的promise对象是ES6中原生的promise对象.
const crypto = require('crypto')
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/index');

var db = mongoose.connection;
db.on('error',function(){
	console.log('数据库连接失败')
})

db.once('open',function(){
	console.log('数据库连接成功')
})

const JM = {
    encrypt:function(data,key){ // 密码加密
        let cipher = crypto.createCipher("bf",key);
        let newPsd = "";
        newPsd += cipher.update(data,"utf8","hex");
        newPsd += cipher.final("hex");
        return newPsd;
    }, 
}

module.exports = JM
