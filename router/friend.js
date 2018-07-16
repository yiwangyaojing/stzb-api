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
//系统消息
const Admininfo = require('../mongod/adminInfo')
//保存系统消息
const saveAdmininfo = require('../model/adminInfo');


//好友添加请求
exports.add = (req,res,next) => {
	if( req.session.user ){
		var id = req.body.id
		if( req.session.user._id !== id ){
				Admininfo.getoneask(req.session.user._id,id,'user-ask',(err,data) => {
					if(err){
						
					res.end(err)
					}
					
					if( data ){
						return res.end('您已经提交过好友请求了!')
					}else{
						console.log('发送请求成功')
						saveAdmininfo.getask(req.session.user._id,req.body.id)
						return res.end('发送请求成功!')		
					}
				})
				
		}else{
			console.log('不能添加自己为好友')
			return res.end('不能添加自己为好友!')
		}
	}else{
		console.log('请先登录')
		return res.end('请先登录')
	}
}


//同意好友请求
exports.addyes = (req,res,next) => {
	//同意好友请求:
	//1,更新双方的好友数据,
	//2,向发送好友请求的人,再返回一个数据,提示他'对方已经接受您的好友请求'
	//3,消息已读
	if( req.session.user ){
		
		User.getUserId( req.session.user._id,(err,data) => {
			//当前同意者的用户
			let s1 = {
				name:data.name,
				id:data._id,
				img:data.img,
			}
			if( err ){
				res.end(err)
			}
			if(data) {
				
				
				User.getUserId( req.body.id,(err,datas) => {
					//发送请求的用户
					let s2 = {
						name:datas.name,
						id:datas._id,
						img:datas.img,
					}
					//提取出所有用户的朋友信息
					var arr1 = data.user_friend;
					var arr2 = datas.user_friend;
					//判断是否已经有这个好友
					var s1t = false;
					var s2t = false
					console.log(arr1)
					console.log(arr2)
					arr1.forEach((d) => {
//						console.log(d)
						if( d.name == s2.name ){
							console.log('相等1')
							console.log(s2.name)
							s1t = true		
							return 
						}
					})
					
					arr2.forEach((d) => {
//						console.log(d)
						if( d.name == s1.name ){
							console.log('相等2')
							console.log(s1.name)
							s2t = true
							return
						}
					})
					
					if( !s1t ){
						arr1.push(s2)
						console.log('进入了1')
						console.log(s2)
					}else{
						console.log('没有进入1')
					}
					
					if( !s2t ){
						arr2.push(s1)
						console.log('进入了2')
						console.log(s1)
					}else{
						console.log('没有进入2')
					}
					
					
					//保存发送请求的用户数据
					console.log(arr1)
					console.log(arr2)
					console.log('分割线')
					data.user_friend = arr1;
					datas.user_friend = arr2
					data.save().then((user) => {
						//保存用户1的数据
						return user
					}).then((user) => {
						//保存用户2的数据
						datas.save()
						Admininfo.getid(req.body.ids,(err,info) => {
							if( err ){
								res.end('同意好友请求失败!')
							}
							if( info ){
								
								//在此处保存已经同意 了 也就是修改已读!!
								info.add_ask = 'yes'
								info.has_look = true
								info.save()
								console.log(info)
							}
						})
						
						
						return user
						
					}).then((user) => {
						
						Admininfo.getoneask(data._id,datas._id,'user-yes',(err,info) => {
							if(err){
								
							res.end(err)
							}
							
							if( info ){
								console.log('您已经同意过此请求了!')
								return res.end('您已经同意过此请求了!')
							}else{
								console.log('发送请求成功')
								console.log(data._id)
								console.log(datas._id)
								saveAdmininfo.getyesadd(data._id,datas._id)
								return res.end('同意成功!')		
							}
						})
						console.log('保存用户三的数据')
						
					})
					
				})
				
				
			}
		})
		
	}else{
		console.log('请先登录!')
		res.end('请先登录!')
	}

}


//拒绝好友请求
exports.addno = (req,res,next) => {
	console.log(req.body)
	if( req.session.user ){
		//发送好友请求的用户id
		var user_id = req.body.id
		//这条消息的id
		var info_id = req.body.ids
		Admininfo.getoneask(req.session.user._id,user_id,'user-no',(err,data) => {
			if(err){
				console.log(err)
				return res.end(err)
			}
			if( data ){
				console.log('已经拒绝过此请求了！')
				res.end('已经拒绝过此请求了！')
			}else{
				
				
				saveAdmininfo.getnoadd(req.session.user._id,user_id)
				//再修改这条好友请求的结果（不同意好友添加或者同意好友）
				Admininfo.getid(info_id,(err,info) => {
					if(err){
						return res.end(err)
					}
					if(info ){
						//在此处重新保存，修改已读，而且不同意好友
						info.add_ask = 'no'
						info.has_look = true
						info.save()
						res.end('拒绝成功！')
					}
				})
				
			}
		})
		
		
	}else{
		res.end('请先登录！')
	}
}



//某条消息标记已读
exports.istrue = (req,res,next) => {
	Admininfo.getid(req.body.id,(err,data) => {
		if( err ){
			res.end('标记已读失败！')
		}
		if( data ){
			data.has_look = true;
			data.save().then((datas) => {
				res.end('标记成功！')
			})
		}
	})
}
