const express = require('express')
const User = require('../mongod/user');
const db = require('../mongod/db');
const auth = require('../model/auth')
const Message = require('../mongod/Message')
const Article = require('../mongod/Article')
//所有系统消息
const Admininfo = require('../mongod/adminInfo')
//注册
exports.zhuce = (req,res,next) => {
	console.log('收到了注册请求')
	//用户名验证
	var usertest = /^[A-Za-z0-9]{5,15}$/
	if( req.body.name.indexOf("@") > 0 || req.body.name.indexOf(" ") > 0 ){
		console.log('用户名不合法')
		return res.end('用户名不合法!')
	}
	//密码验证
	var pastest = /^.{3,20}$/
	if( !pastest.test(req.body.pas) || req.body.pas.indexOf(" ") > 0 ){
		console.log('密码不合法!')
		return res.end('密码不合法!')
	}
	//再次密码验证
	if( !pastest.test(req.body.pas2) || req.body.pas2.indexOf(" ") > 0 || req.body.pas !== req.body.pas2 ){
		console.log('两次密码不合法')
		return res.end('两次密码不合法!')
	}
	//邮箱格式验证
	var emiltest = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
	if( !emiltest.test(req.body.emil) ){
		console.log('邮箱不合法')
		return res.end('邮箱不合法!')
	}
	
	var datas = new User(req.body)
	//判断邮箱或者账号是否存在
	User.findOne().or([{name:req.body.name},{emil:req.body.emil}]).then((data) => {
		if( data ){
			console.log('用户已经存在')
			res.end('用户/邮箱已经存在!')
		}else{
			
			console.log('可以注册')
			//保存用户信息
			
			let newPsd = db.encrypt(req.body.pas,'stzb');
			datas.pas = newPsd
			datas.save(function(err,data){
				
				if( err ){
					console.log('注册失败!')
					res.end('系统错误注册失败')
				}else{
					console.log('恭喜注册成功')
					res.json({message:'恭喜注册成功!'})
					return next()
				}
			})
			
			
			
		}
	}).catch((err) => {
		console.log(err)
		console.log('判断账号是否存在出现错误!!')
	})
	
}

//登录
exports.denglu = (req,res,next) => {
	var pas = req.body.pas;
	var name = req.body.name;
	var getname;
	var emilname;
	//生成登录方式
	var denglu;
	//判断是普通登录还是邮箱登录
	if( name.indexOf('@') > 0 ){
		emilname = name;
	}else{
		getname = name
	}
	
	//登录方式发放
	if( getname ){
		console.log('普通用户登录')
		denglu = User.getUserName;
	}
	if( emilname ){
		console.log('邮箱登录')
		denglu = User.getUserEmil;
	}
	
	//登录验证
	
	denglu(name,(err,data) => {
		if( err ){
			console.log('系统错误,登录失败!')
			console.log(err)
			return res.end('系统错误,登录失败!')
		}
		if( !data ){
			console.log('用户名/邮箱不存在,请注册')
			return res.end('用户名/邮箱不存在,请注册')
		}else{
			
			
			let newPsd = db.encrypt(pas,'stzb');
			if( data.pas == newPsd ){
				auth.upCookie(res,data._id)
//				auth.upSession(req,res,next)
				console.log('登录成功')
				return res.json({message:'登录成功!'})
			}else{
				console.log('密码错误')
				return res.end('密码错误!')
			}
			
			
		}
	})
}


//退出
exports.tuichu = (req,res,next) => {
	req.session.destroy();   //销毁数据
	res.clearCookie('stzb');  //c清空ookie
	res.redirect('/');   //跳转首页
}


//检测用户是否存在
exports.jiance = (req,res,next) => {
	if( req.session.user ){
		var datas = {}
		User.getUserId(req.session.user._id,(err,user) => {
			datas['user'] = user;

				if(user){
					//获取所有消息
					Message.getIdAll(req.session.user._id,(err,data) => {
						if( data ){
							//获取所有系统消息
							Admininfo.getall(req.session.user._id,(err,info) => {
								if( err ){
									res.end(err)
								}
								
								if( info ){
									//所有普通消息
									datas['xx'] = data
									//所有系统消息
									datas['admin'] = info
									
									
									res.json({message:datas,error:''})
								}
									
								
								
							})
						}	
						
					})
							
				}
				
				
			})
	}else{
		res.json({message:'',error:'用户未登录'})
	}
}
