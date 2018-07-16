const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//产生消息的模块(提示消息),并不是回复消息的模块
const MessageScheam = new Schema({
	//当前的大文章id(只是文章id!!)
	article_id:{
		type:String,
		ref:'Article'
	},
	//大文章作者id
	article_user_id:{
		type:String,
		ref:'user',
	},
	//一级回复的id
	reply_id:{
		type:String,
	},
	//二级多级回复的id
	comment_id:{
		type:String,
	},
	//谁@(回复了)你
	use_at:{
		type:String,
		ref:'user',
	},
	//被@(回复)的人
	at_user:{
		type:String,
		ref:'user',
	},
	//@类型(回复,回复中@,普通文章@)
	type:{
		type:String,
	},
	//回复创建时间
	time:{
		type:Date,
		default:Date.now
	},
	//是否已读
	has_look:{
		type:Boolean,
		default:false,
	},
	//如果是回复显示回复的内容,如果是@(不显示)
	reply_content:{
		type:String,
	}
})

MessageScheam.statics = {
	//查找当前用户的所有消息通知
	getIdAll:(id,callback) => {
		Message.find({at_user:id}).populate('use_at article_id').then((data) => {
			callback(null,data)
		}).catch((err) => {
			callback(err)
		})
	},
	//查询所有未读消息并且更新为已读
	getAllFalse:(id,callback) => {
		Message.updateMany({'has_look':false},{'has_look':true}).then((data) => {
			callback(null,data)
		}).catch((err) => {
			callback(err)
		})
	}
}

const Message = mongoose.model('message',MessageScheam);
module.exports = Message;
