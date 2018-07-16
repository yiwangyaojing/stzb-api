const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const index = require('./router/index')
const article = require('./router/article')
const reply = require('./router/reply')
const user = require('./router/user')
var multer = require('multer');
const comment = require('./router/comment')
//好友功能
const friend = require('./router/friend');
//管理员
const admin = require('./router/admin')

const stzb = require('./router/stzb')
//回复和文章的图片设置
var storage = multer.diskStorage({
	destination:'www/img',
	filename:function(req,res,cb){
		var goods = req.body.imgs
		cb(null,goods + '.jpg' )
	}
})
var upload = multer({storage:storage});

//-------------------------------------------------------------前端-------------------------------------------------

//个人信息的图片设置
var storage1 = multer.diskStorage({
	destination:'www/img',
	filename:function(req,res,cb){
		if( !req.session.user ){
			return
		}
		var goods = req.session.user.name
		cb(null,goods + '.jpg' )
	}
})
var upload1 = multer({storage:storage1});

//检测用户是否存在
router.post('/stzb/jiance',index.jiance)
//率土信息
router.post('/stzbshow',stzb.imgshow);




//注册
router.post('/zhuce',index.zhuce);

//登录
router.post('/denglu',index.denglu)

//退出
router.post('/tuichu',index.tuichu)




//发布普通文章
router.post('/add/article',upload.single('photo'),article.add)
//获取所有文章
router.post('/article/getAll',article.getAll)
//获取单个文章
router.post('/article/show/:id',article.show);



//一级回复发布
router.post('/article/reply',upload.single('photo'),reply.add);
//二级回复发布
router.post('/article/reply/comment',comment.add);
//二级多级回复获取
router.post('/article/reply/commentlist',comment.get);




//用户头像更改
router.post('/user/updatedimg',upload1.single('photo'),user.updatedimg)
//用户所有消息已读
router.post('/user/info/all',user.infoall)
//通过id获取所有用户发布的文章
router.post('/user/allarticle',user.article)
//通过id获取用户的所有一级二级多级回复
router.post('/user/allreply',user.reply)
//查看别人用户的信息(朋友的信息)
router.post('/user/friend',user.friend);





//router.get('/chat',chat.on)




//好友信息请求
router.post('/add/true/friend',friend.add)
//确认添加好友
router.post('/add/friend/yes',friend.addyes)
//拒接添加好友
router.post('/add/friend/no',friend.addno);
//消息标记已读
router.post('/add/friend/true',friend.istrue)

//-------------------------------------------------------------------------后端------------------------------------------------
//主页(或者是注册页面)
router.get('/index',admin.home)
router.get('/',admin.denglu)
//注册页面(一般不开放!!!)
//router.get('/zhuce',admin.zhuce)
//注册提交
router.post('/admin/zhuce/admin/zhuce/admin/zhuce/admin/zhuce',admin.zhuce)
//登录页面
router.get('/denglu',admin.denglu)
//登录提交
router.post('/admin/denglu/admin/denglu/admin/denglu/admin/denglu',admin.denglus)
//删除用户
router.post('/de/user',admin.deuser)
//删除文章
router.post('/de/article',admin.dearticle)
//删除某个回复
router.post('/de/reply',admin.dereply)


module.exports = router;
