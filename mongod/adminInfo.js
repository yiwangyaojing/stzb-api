const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdmininfoSchema = new Schema({
	//系统消息两种
	//系统(网站作者,后台管理员)向某个人发送了消息,系统(网站作者,后台管理员)向所有人发送了消息
	//某个普通用户向谁发送了消息(好友请求),
	time:{
		type:Date,
		default:Date.now,
	},
	//消息类型(admin,user)
	//1,系统消息:向谁发送消息,向所有人发送消息
	//2,用户消息:好友提示,拒接好友,接受好友
	type:{
		type:String,
	},
	//用户消息类型;
	//1:好友请求,ask,
	//2:同意请求,yes,
	//3:不同意,no,
	user_type:{
		type:String,
	},
	//如果是普通用户
	//发消息的人
	use_id:{
		type:String,
		ref:'user'
	},
	//消息内容
	content:{
		type:String,
	},
	//接收人
	at_id:{
		type:String,
		ref:'user'
	},
	//是否已读
	has_look:{
		type:Boolean,
		default:false,
	},
	//同意添加好友还是不同意
	add_ask:{
		type:String,
	}
})

AdmininfoSchema.statics = {
	//获取用户的所有系统消息
	getall:(id,callback) => {
		Admininfo.find({'at_id':id}).populate('use_id').sort({'time':-1}).then((data) => {
			callback(null,data)
		}).catch((err) => {
			callback(err)
		})
	},
	
	//查询请求消息是否重复
	getoneask:(use_id,at_id,type,callback) => {
		Admininfo.findOne({'use_id':use_id,'at_id':at_id,'user_type':type,'has_look':false}).then((data) => {
			callback(null,data)
		}).catch((err) => {
			callback(err)
		})
	},
	//通过id查找某个回复
	getid:(id,callback) => {
		Admininfo.findOne({'_id':id,'has_look':false}).then((data) => {
			callback(null,data)
		}).catch((err) => {
			callback(err)
		})
	}
}

const Admininfo = mongoose.model('admininfo',AdmininfoSchema);

module.exports = Admininfo
