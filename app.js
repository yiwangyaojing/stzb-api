const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cookie = require('cookie-parser');
const session = require('express-session');
const ejs = require('ejs');
const flash = require('connect-flash');
const MongStore = require('connect-mongo')(session)
const auth = require('./model/auth')
//导入路由文件
const router = require('./routers');

const app = express();
const chat = require('./router/chat')
//使用路由规则
app.set('views','./views');
app.set('view engine','ejs');
app.use(express.static('www'));
app.use(bodyparser.urlencoded({extended:false}));
//cookie加密
app.use(cookie('stzb'))
//session加密
app.use(session({
	secret:'stzb',
	resave:true,
	saveUninitialized:true
}))
//加载用户session设置
app.use(auth.upSession)	

//设置session数据,可在浏览器端接受;
app.use((req,res,next) => {
	//全局设置res.locals对象,浏览器端的末班页面均可接受数据;
	//res.render(pa1,{})    {}中设置的数据保存在res.locals对象中
//	res.locals.userInfo = req.session.user;
//	console.log('首页设置session')
	next();
})
app.use('/',router)
app.listen('2200',function(){
	console.log('服务器连接成功-2200')
})
