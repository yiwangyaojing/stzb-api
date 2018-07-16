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
var multer = require('multer');

//二级回复增加
exports.add = (req,res,next) => {
	//大文章的时间转换
	var time1 = new Date(req.body.id - 0);
	//一级回复的时间转换
	var time2 = new Date(req.body.time - 0);
	console.log(req.body)
	Article.getTime(time1,(err,article) => {
		if(err){
			
			return res.end('系统错误,二级回复失败!')
		}
		if( article ){
			article.last_time = new Date();
			article.reply_num ++;
			var articles = new Article(article)
			articles.save()
			//一级回复查询
			Reply.getTime(time2,(err,reply) => {
				if( err ){
					return res.end('系统错误,二级回复失败!')
				}
				if( !reply ){
					return res.end('文章不存在,二级回复失败!')
				}
					
				
				
				var data = new Comment();
				//内容
				data.content = req.body.content;
				//当前的回复者
				data.author_id = req.session.user._id
				//大文章的id
				data.article_id = article.id;
				//大文章的作者id
				data.article_user_id = article.author;
				//一级回复的文章id
				data.reply_id = reply._id;
				//一级回复的作者id
				data.reply_user_id = reply.author_id;
				//如果有二级回复
				//二级回复查询
//				if( req.body.comment ){
//					console.log('二级回复的id存在,该回复是多级回复')
//				}else{
//					console.log('二级回复的id不存在')
//				}
				
				data.save().then((datas) => {
					//1,如果登陆者不是作者的话,那么文章作者积分加5
					if(article.author + 0 !== req.session.user._id + 0){
						console.log(article.author)
						console.log(req.session.user._id)
						User.getUserId(article.author,(err,user) => {
							if(user){
								user.jifen += 5
								user.save()
							}
						})
					}
					return datas
				}).then((datas) => {
					//2,一级回复的回复量加1
					reply.comment_num++
					reply.save()
					
					return datas
				}).then((datas) => {
					//3,当前登录人(二级回复的作者),积分加5,回复量加1,并且更新session中的数据
					User.getUserId(req.session.user._id,(err,user) => {
						if(user){
							user.jifen += 5
							user.article_reply_num ++ 
							user.save()
						}
					})
					
					return datas
				}).then((datas) => {
					//4,如果有@,通知@的人
					//1大文章的文章id,2一级回复的作者id,3二级回复的作者id,4当前的登录人id,5要@的人,6大文章的作者id,7一级回复的id
					
					if( req.body.comment ){
						at.UserCommentAt(article.id,reply.author_id,req.body.comment,req.session.user._id,req.body.content,article.author,data._id)
					}else{
						at.UserCommentAt(article.id,reply.author_id,null,req.session.user._id,req.body.content,article.author,data._id)
					}
					
					return datas
				}).then((datas) => {
					//5,进行回复通知
					//如果当前的登录人不是大文章的作者,也不是一级回复的作者,那么两个都通知.
					//如果当前的登录人是大文章的作者,不是一级回复的作者,只通知一级回复的作者.
					//如果当前的登录人不是大文章的作者,是一级回复的作者,那么只通知大文章的作者
					//如果都是,都不通知
					
					
					if( !req.body.comment ){
							
						if( req.session.user._id + 0 !== article.author + 0 && req.session.user._id + 0 !== reply.author_id + 0 ){
							//谁,某篇文章,文章作者id(被回复的人),一级回复的id,二级回复的id,该回复的内容
							//当大文章作者不是一级回复作者时
							if( article.author + 0 !== reply.author_id + 0 ){
								console.log('1')
								upat.Reply(req.session.user._id,article.id,article.author,data._id,null,req.body.content)
								
								upat.Reply(req.session.user._id,article.id,reply.author_id,data._id,null,req.body.content)
							}else{
								
								console.log('2')
								upat.Reply(req.session.user._id,article.id,article.author,data._id,null,req.body.content)
							}
							
						}
						
						
						if( req.session.user._id + 0 == article.author + 0 && req.session.user._id + 0 !== reply.author_id + 0 ){
							//谁,某篇文章,文章作者id(被回复的人),一级回复的id,二级回复的id,该回复的内容
							console.log('3')
							upat.Reply(req.session.user._id,article.id,reply.author_id,data._id,null,req.body.content)
						}
						
						
						if( req.session.user._id + 0  !== article.author + 0  && req.session.user._id + 0 == reply.author_id + 0 ){
							//谁,某篇文章,文章作者id(被回复的人),一级回复的id,二级回复的id,该回复的内容
								console.log('4')
							upat.Reply(req.session.user._id,article.id,article.author,data._id,null,req.body.content)
						}
						
					
					}else{
						//当前的登录人
						var s1 = req.session.user._id + 0;
						//大文章的作者
						var s2 = article.author + 0 
						//一级回复的作者
						var s3 = reply.author_id + 0
						//二级回复的而作者
						var s4 = req.body.comment + 0
						
						//通知大文章作者
						if( s2 == s3 && s2 == s4 && s2 !== s1 ){
							//谁,某篇文章,文章作者id(被回复的人),一级回复的id,二级回复的id,该回复的内容
							console.log('1')
							upat.Reply(req.session.user._id,article.id,article.author,data._id,req.body.comment,req.body.content)
								
						}
						
						//通知二级回复的作者
						if( s2 == s3 && s2 !== s4 && s1 == s2){
							
							console.log('2')
							//谁,某篇文章,文章作者id(被回复的人),一级回复的id,二级回复的id,该回复的内容
							upat.Reply(req.session.user._id,article.id,req.body.comment,data._id,req.body.comment,req.body.content)
						}
						
						//通知一级回复的作者
						if( s1 == s2 && s1 == s4 && s1 !== s3 ){
							console.log('3')
							
							//谁,某篇文章,文章作者id(被回复的人),一级回复的id,二级回复的id,该回复的内容
							upat.Reply(req.session.user._id,article.id,reply.author_id,data._id,req.body.comment,req.body.content)
						}
						
						//通知二级回复和一级回复的作者
						if( s1 == s2 && s1 !== s3 && s1 !== s4 ){
							
							console.log('4')
							
							//谁,某篇文章,文章作者id(被回复的人),一级回复的id,二级回复的id,该回复的内容
							upat.Reply(req.session.user._id,article.id,reply.author_id,data._id,req.body.comment,req.body.content)
							upat.Reply(req.session.user._id,article.id,req.body.comment,data._id,req.body.comment,req.body.content)
						}
						
						//通知大文章作者和一级回复作者
						if( s1 == s4 && s1 !== s2 && s1 !== s3 ){
							
							console.log('5')
							//谁,某篇文章,文章作者id(被回复的人),一级回复的id,二级回复的id,该回复的内容
							upat.Reply(req.session.user._id,article.id,reply.author_id,data._id,req.body.comment,req.body.content)
							upat.Reply(req.session.user._id,article.id,article.author,data._id,req.body.comment,req.body.content)
						}
						
						//通知大文章作者和二级回复作者
						
						if( s1 == s3 && s1 !== s2 && s1 !== s4  ){
							console.log('6')
							//谁,某篇文章,文章作者id(被回复的人),一级回复的id,二级回复的id,该回复的内容
							upat.Reply(req.session.user._id,article.id,article.author,data._id,req.body.comment,req.body.content)
							
							upat.Reply(req.session.user._id,article.id,req.body.comment,data._id,req.body.comment,req.body.content)
						}
						
						//通知所有人
						if( s1 !== s2 && s1 !== s3 && s1 !== s4){
							if( s2 !== s3 && s2 !== s4 ){
								if( s3 !== s4  ){
									console.log('7')
									//谁,某篇文章,文章作者id(被回复的人),一级回复的id,二级回复的id,该回复的内容
									upat.Reply(req.session.user._id,article.id,article.author,data._id,req.body.comment,req.body.content)
									upat.Reply(req.session.user._id,article.id,req.body.comment,data._id,req.body.comment,req.body.content)
									upat.Reply(req.session.user._id,article.id,reply.author_id,data._id,req.body.comment,req.body.content)
								}
							}
							
						}
						//通知二级回复的作者
						if( s1 !== s2 && s2 == s3 && s3 !== s4){
							
								console.log('8')
							upat.Reply(req.session.user._id,article.id,req.body.comment,data._id,req.body.comment,req.body.content)
						}
						
						
					}
					
					
					
					return datas
				}).then((datas) => {
					
					res.end('回复成功!')
				}).catch((err) => {
				})
				
				
				
			})
		}else{
			res.end('文章不存在,二级回复失败!')
		}
	})
}



//获取所有的二级回复
exports.get = (req,res,next) => {
	
	Comment.getReply(req.body.num,(err,data) => {
		if( err ){
			return res.end('获取回复失败!')
		}
		
		if( data ){
			res.json({message:data})
		}
		
	})
}
