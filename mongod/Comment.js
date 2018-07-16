const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db = require('./db')


const CommentSchema = new Schema({
	//大文章的文章id
	article_id:{
		type:String,
		ref:'Article',
	},
	//大文章的作者id
	article_user_id:{
		type:String,
		ref:'User'
	},
	//一级回复的文章id
	reply_id:{
		type:String,
		ref:'Reply'
	},
	//一级回复的作者id
	reply_user_id:{
		type:String,
		ref:'User'
	},
	//二级回复的文章id
	comment_id:{
		type:String,
		ref:'Comment'
	},
	//二级回复的作者id
	comment_user_id:{
		type:String,
		ref:'User'
	},
	//当前回复的作者
	author_id:{
		type:String,
		ref:'user'
	},
	//回复内容
	content:{
		type:String,
	},
	//回复时间
	time:{
		type:Date,
		default:Date.now,
	},
	//是否被删除
	isDe:{
		type:Boolean,
		default:false,
	}
})



CommentSchema.statics = {
	
	//通过某个一级回复,获取所有的二级多级回复
	getReply:(id,callback) => {
		Comment.find({'reply_id':id},{'isDe':false}).populate('author_id reply_id').then((data) => {
			callback(null,data)
		}).catch((err) => {
			callback(err)
		})
	},
	//通过用户id,获取所有的二级多级回复
	getuser:(id,callback) => {
		Comment.find({'author_id':id},{'isDe':false}).sort({'time':-1}).populate('article_id').then((data) => {
			callback(null,data)
		}).catch((err) => {
			callback(err)
		})
	}
	
}

const Comment = mongoose.model('comment',CommentSchema)
module.exports = Comment