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
//导入武将的数据库
const Wujiang = require('../mongod/wujiang')

exports.imgshow = (req,res,next) => {
	
	Wujiang.getwujiang(req.body.num,req.body.t,(err,data) => {
		if( err ){
			return res.end('获取数据错误,请返回重试!')
		}
		if( data ){
			return res.json({message:data})
		}
	})
}
