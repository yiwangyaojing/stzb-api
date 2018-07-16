const express = require('express')
const User = require('../mongod/user');
const db = require('../mongod/db');
const auth = require('../model/auth');
const Article = require('../mongod/Article')
const setting = require('../setting')
const at = require('../model/at')
const upat = require('../model/upAt')
var multer = require('multer');


const Reply = require('../mongod/Reply')


exports.add = (req,res,next) => {
	var time = new Date(req.body.id - 0);
	console.log(req.body)
	Article.getTime(time,(err,data) => {
		if( !data ){
			return res.end('文章不存在,或者已经被删除!');
		}
		//当前登陆者积分加5
		User.getUserId(req.session.user._id,(err,user) => {
			user.jifen += 5;
			user.save();
			req.session.user = user
		})
		//如果当前的登录者不是大文章的作者那么,当前作者积分加5
		if( data.author !== req.session.user._id ){
			User.getUserId(data.author,(err,user) => {
				user.jifen += 5;
				user.save();
			})
		}
		
		
		let datas = new Reply();
		//一级回复的内容
		datas.content = req.body.content;
		//一级回复的作者id
		datas.author_id = req.session.user._id;
		//大文章的作者id
		datas.article_user_id = data.author;
		//大文章的文章id
		datas.article_id = data._id
		if( req.body.is == 'true' ){
			datas.img = req.body.imgs
		}
		datas.save().then((datas) => {
			
			return datas
		}).then((datas) => {
		//1,该文章的最后回复时间更新,最后回复人更新,回复数量加1
//			console.log(data)
			data.last_user = req.session.user.name;
			data.last_content = datas.content;
			data.last_time = new Date();
			data.reply_num ++;
			var articles = new Article(data)
			articles.save()
			return datas
		}).then((datas) => {
			//2,执行@请求(如果有@执行,没有@则不会执行,直接进行回复请求,所以不用担心@和回复出现重复的问题)
			
			//大文章的id,当前一级回复的id,登录人的id,要@的人,大文章的作者id
			at.UserReplyAt(data._id,datas._id,req.session.user._id,datas.content,data.author)

			
			
			return datas
		}).then((datas) => {
			//3,执行回复请求
			//1,谁回复的,2当前的文章id,3文章作者id,4一级回复的id,5二级回复的id,6,回复内容
			if( req.session.user._id + 0 !== data.author + 0 ){ 	
				console.log(req.session.user._id)
				console.log(data.author)
				upat.Reply(req.session.user._id,data._id,data.author,datas._id,null,datas.content)
			}
			
			return datas
		}).then((datas) => {
			res.end('回复成功!')
		}).catch((err) => {
			res.end('回复失败,请联系管理员')
		})	
	})
}
