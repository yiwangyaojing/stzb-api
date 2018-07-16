const express = require('express');
const User = require('../mongod/user')

const auth = {
	//设置cookie
	upCookie:function(res,id){
		console.log('正在设置cookie')
//		console.log(id)
		res.cookie('stzb',id,{
			signed:true, 
			//毫秒计算,目前一分钟
			maxAge:1000 * 60,
			path:'/',
		})
//		console.log('设置cookie成功')
	},
	//req.signedCookies 获取的是被签名的cookie;
	upSession:function(req,res,next){
//		console.log('正在设置session')
		
		if( req.session.user ){
			
			User.getUserId(req.session.user._id,(err,user) => {
				if(user){
					req.session.user = user
				}
			})
			
			return next()
		}else{
//			console.log(req.signedCookies)
			var cookie_id = req.signedCookies['stzb'];
			if( !cookie_id ){
				return next()
			}
			User.getUserId(cookie_id,(err,data) => {
				if( err ){
					console.log('系统错误,session设置失败')
					next()
				}
				if(!data){
					console.log('cookie查找用户失败')
					next()
				}else{
					req.session.user = data
					console.log('设置session成功')
					next()
				}
			})
			
		}
		
	}
	
}


module.exports = auth