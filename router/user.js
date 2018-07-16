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
//通知消息
const Message = require('../mongod/Message');
var multer = require('multer');


//更改个人头像
exports.updatedimg = (req,res,next) => {
	
	if( req.body.is == 'true' ){
			var id = req.session.user._id
			if( !req.session.user ){
				return res.end('请先登录!!')
			}
			
			User.getUserId(id,(err,data) => {
				if( !data ){
					return res.end('用户不存在!!')
				}
				data.img = req.session.user.name
				data.save()
				return res.end('修改成功')
			})
	}
	
	

}


//获取所有文章
exports.article = (req,res,next) => {
	Article.getUser(req.body.id,(err,data) => {
		if( err ){
			console.log('获取文章失败')
			return res.end('获取文章失败')
		}
		if( data ){
			return res.json({message:data})
		}
	})
}


//获取所有回复
exports.reply = (req,res,next) => {
	console.log(req.body)
	Reply.getuser(req.body.id,(err,reply) => {
		if(err){
			return res.end('查找回复失败~')
		}
		if(reply){
			Comment.getuser(req.body.id,(err,comment) => {
				if(err){
					return res.end('查找回复失败~')
				}
				if(comment){
					var data = {
						reply:reply,
						comment:comment,
					}
					return res.json({message:data})
				}
			})
			
		
			
		}
	})
}

//消息全部已读
exports.infoall = (req,res,next) => {

	if(req.session.user._id){
		
		Message.getAllFalse(req.session.user._id,(err,data) => {
			if( err ){
				return res.end(err)
			}
			if(data){
				return res.end('标记已读成功!')
			}
		})
		
	}else{
		res.end('请先登录!')
	}
}


//好友界面
exports.friend = (req,res,next) => {
	User.getUserId(req.body.id,(err,data) => {
		if( err ){
			return res.end('获取信息失败!')
		}
		if( data ){
			var datas = data
			datas.pas = '这是密码你信吗~'
			res.json({message:datas,newid:req.session.user._id})
		}
	})
}
