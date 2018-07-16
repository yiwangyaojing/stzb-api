const express = require('express')
const User = require('../mongod/user');
const db = require('../mongod/db');
const auth = require('../model/auth');
const Article = require('../mongod/Article')
const setting = require('../setting')
const at = require('../model/at')
const upat = require('../model/upAt')
//一级回复
const Reply = require('../mongod/Reply')
//二级回复
const Comment = require('../mongod/Comment')
//导入管理员
const Admin = require('../mongod/admin')

//主页
exports.home = (req,res,next) => {
	//所有用户
	User.find().then((user) =>{
		//所有文章
		Article.find().populate('author').then((article) => {
			//所有一级回复
			Reply.find().populate('article_id author_id').then((reply) => {
				//所有二级回复
				Comment.find().populate('article_id author_id').then((comment) => {
					comment.forEach((c) => {
						reply.push(c)
					})
					reply.sort(function(a,b){
						var aa = new Date(a.time).getTime()
						var bb = new Date(b.time).getTime()
						return bb - aa
					})
					var data = {
						user,
						article,
						reply,
					}
					
						res.render('index',{
							title:'率土之滨',
							data:data
						})
					
				})
			})
		
		})
		
	} )

	
}

//(注册页面)
exports.zhuce = (req,res,next) => {
	res.render('zhuce',{
		title:'率土之滨',
	})
}
//跳转登录页面
exports.denglu = (req,res,next) => {
	res.render('denglu',{
		title:'率土之滨',
	})
}


//注册
exports.zhuce = (req,res,next) => {
	if( req.body.pas1 !== req.body.pas2 ){
		res.end('两次密码不一致,请重新输出')
	}
	let newPsd = db.encrypt(req.body.pas1,'stzb');
	var data = new Admin()
	data.adminName = req.body.name;
	data.adminPas = newPsd
	Admin.admingetname(req.body.name,(err,datas) => {
		if( err ){
			res.end(err)
		}
		if( datas ){
			res.end('该管理员已经存在!')
		}else{
				data.save().then((content) => {
					res.end('注册成功,请登陆吧!')
				})
		}
	})

}


//登录提交
exports.denglus = (req,res,next) => {
	Admin.admingetname(req.body.name,(err,datas) => {
		if( err ){
			
			res.end(err)
			
		}
		if( datas ){
			
		let newPsd = db.encrypt(req.body.pas,'stzb');
		
		if( newPsd == datas.adminPas ){
			res.end('登录成功,即将进行跳转')
		}else{
			res.end('密码错误')	
		}
			
		}else{
			
			res.end('管理员账号不存在!')
		}
	})
}


//删除用户
exports.deuser = (req,res,next) => {
	console.log(req.body)
	
	User.remove({'_id':req.body.id}).then((data) => {
		console.log('删除用户成功')
		res.end('删除用户成功')
	}).catch((err) => {
		console.log('删除用户失败')
		res.end(err)
	})
	
}


//删除文章
exports.dearticle = (req,res,next) => {
		console.log(req.body)
	
	Article.remove({'_id':req.body.id}).then((data) => {
		console.log('删除文章成功')
		res.end('删除文章成功')
	}).catch((err) => {
		console.log('删除文章失败')
		res.end(err)
	})
}

//删除,回复
exports.dereply = (req,res,next) => {
	var id = req.body.id
	
	
	Reply.findOne({'_id':id}).then((data) => {
		if( data ){
				Reply.remove({'_id':id}).then((data) => {
					console.log('删除回复成功1')
					res.end('删除回复成功')
				}).catch((err) => {
					console.log('删除回复失败')
					res.end(err)
					
				})
		}
	})
	
	
	Comment.findOne({'_id':id}).then((data) => {
		if( data ){
				Comment.remove({'_id':id}).then((data) => {
						console.log('删除回复成功2')
						res.end('删除回复成功')
				}).catch((err) => {
						console.log('删除文章失败2')
					res.end(err)
				})
		}
	})
	

//	

	
}
