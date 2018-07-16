const express = require('express')
const User = require('../mongod/user');
const db = require('../mongod/db');
const auth = require('../model/auth');
const Article = require('../mongod/Article')
const setting = require('../setting')
const at = require('../model/at')
var multer = require('multer');
//一级回复
const Reply = require('../mongod/Reply')

//var storage = multer.diskStorage({
//	destination:'www/img',
//	filename:function(req,res,cb){
//		var goods = '45'
//		cb(null,goods + '.jpg' )
//	}
//})
//var upload = multer({storage:storage});


//普通文章增加
exports.add = (req,res,next) => {
	
	
	console.log(req.body)
	
	
	
	
	
	
	if( req.body.content.trim().length == 0 || req.body.title.trim().length == 0){
		
		return res.end('标题/内容不合法!')
	}
	if( setting.type.indexOf(req.body.type) < 0 ){
		return res.end('请选择正确类型')
	}
	
	
	var article = new Article(req.body)
	article.author = req.session.user._id
//	判断是否登录了
	if( req.session.user ){
		if( req.body.is == 'true' ){
			article.img = req.body.imgs
		}
		article.save().then((data) => {
			//更新数据
			User.getUserId(req.session.user._id,(err,user) => {
				if(user){
					user.article_num ++;
					user.jifen += 5;
					user.save();
					req.session.user = user
				}
			})
			
			
			res.json({message:'文章发布成功!'})
			return data
		}).then((data) => {
			
//			console.log(at.UseAt(data.content))
			at.UseAt(data._id,'',req.session.user._id,data.content)
			
		}).catch((err) => {
			console.log(err)
			res.end('保存文章失败!')
		})
		
	}else{
		res.end('请先登录 !!')
	}
	
}


//获取所有普通文章
exports.getAll = (req,res,next) => {
	console.log(req.body)
	//设置每页显示多少
	var show = 1;
	//获取当前的页面个数
	var num = req.body.num;
	//获取当前显示的类型
	var type = req.body.type;
	
	if( type == '全部帖子' ){
		Article.find({'isDe':false}).skip(num* show ).limit( show ).populate('author').sort({'last_time':-1}).then((data) => {
			
		res.json({message:data})
		
		}).catch((err) => {
			console.log(err)
		})
	}else{
		Article.find({'type':type},{'isDe':false}).skip(num * show ).limit( show ).populate('author').sort({'last_time':-1}).then((data) => {
			
		res.json({message:data})
		
		}).catch((err) => {
			console.log(err)
		})
	}
	
	

}

//获取单个文章
exports.show = (req,res,next) => {
	//当前文章的毫秒时间数
	let time = new Date(req.params.id - 0);
	Article.findOne({'times':time},{'isDe':false}).populate('author').then((datas) => {
		
		datas.looks_num ++
		datas.save()
		if( datas ){
			
			Reply.getArticle(datas._id,(err,data) => {
				if(err){
					return res.end('获取回复失败,请联系管理员')
				}
				if(data){
					let all = [];
					//该文章
					all.push(datas);
					//一级回复
					all.push(data);
					
					return res.json({message:all})
					
					
				}else{
				}
			})
			
			
			
		}else{
			res.end('文章不存在或者已经删除!')
		}
		
	}).catch((err) => {
		
	})
	
	
}




