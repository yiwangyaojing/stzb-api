const mongoose = require('mongoose')
const db = require('./db');


var UserSchema = mongoose.Schema({
	//用户名
	name:String,
	pas:String,
	emil:String,
	//个人简介
	motto:{
		type:String,
		default:'这个家伙很懒,什么都没有留下...',
	},
	//头像
	img:{
		type:String,
		default:'img',
	},
	//创建时间(用于找回密码)
	user_time:{
		type:Date,
		default:Date.now
	},
	//修改资料时间(用于找回密码)
	user_update_time:{
		type:Date,
		default:Date.now,
	},
	//发布的文章数量(只是帖子)
	article_num:{
		type:Number,
		default:0,
	},
	//所有的文章回复量(帖子回复)
	article_reply_num:{
		type:Number,
		default:0,
	},
	//所有陪将发帖数量
	peijiang_num:{
		type:Number,
		default:0,
	},
	//所有的陪将回复数量
	peijiang_reply_num:{
		type:Number,
		default:0
	},
	//所得积分
	jifen:{
		type:Number,
		default:0
	},
	//关注别人的数量
	follows:{
		type:Number,
		default:0
	},
	//被关注量
    be_followed:{
    	type:Number,
    	default:0,
    },
	//所得全部头衔
	list_style:{
		type:Array,
		default:[
			{
				name:'率土新人',
				color:'#EEEED1',
			}
		]
	},
	//当前佩戴头衔
	use_style:{
		type:Object,
		default:{
			name:'率土新人',
			color:'#EEEED1',
		}
	},
	//好友
	user_friend:{
		type:Array,
	},
	//黑名单
	user_badman:{
		type:Array,
	},
	//关注功能
	good_article:{
		type:Array,
		default:[],
	}
	
})

//静态方法
UserSchema.statics = {
	//普通用户登录
	getUserName:(id,callback) => {
		User.findOne({name:id}).then((data) => {
			callback(null,data)
		}).catch((err) => {
			callback(err)
		})
	},
	//通过邮箱登录
	getUserEmil:(id,callback) => {
		User.findOne({emil:id}).then((data) =>{
			callback(null,data)
		}).catch((err) => {
			callback(err)
		})
	},
	//通过id登录
	getUserId:(id,callback) => {
		User.findOne({'_id':id}).then((data) => {
			callback(null,data)
		}).catch((err) => {
			callback(err)
		})
	},
	//获取十个用户
//	getallUser:()
	//更改用户中的好友
//	getFriend:(id,data,callback) => {
//		User.update({'_id':id},{'user_friend':data}).then((data) => {
//			callback(null,data)
//		}).catch((err) => {
//			callback(err)
//		})
//	}
}

const User = mongoose.model('user',UserSchema)

module.exports = User










