const mongoose = require('mongoose');
const db = require('./db');
const Schema = mongoose.Schema

const ReplySchema = new Schema({
	
	//一级回复内容
	content:String,
	//回复时间
	time:{
		type:Date,
		default:Date.now,
	},
	//当前回复的作者
	author_id:{
		type:String,
		ref:'user',
	},
	//当前回复的大文章的作者id
	article_user_id:{
		type:String,
		ref:'User',
	},
	//当前回复的大文章id
	article_id:{
		type:String,
		ref:'Article',
	},
	//点赞数量
	like_num:{
		type:Number,
		default:0
	},
	//二级(多级回复数量)
	comment_num:{
		type:Number,
		default:0
	},
	//是否删除
	isDe:{
		type:Boolean,
		default:false,
	},
//	一级回复的图片
	img:{
		type:String,
	}
	
})


ReplySchema.statics = {
	//查找该谋篇文章的所有一级回复
	getArticle:(id,callback) => {
		Reply.find({'article_id':id},{'isDe':false}).sort({'time':-1}).populate('author_id').then((data) => {
			callback(null,data)
		}).catch((err) => {
			callback(err)
		})
	},
	//利用时间查找某个一级回复
	getTime:(id,callback) => {
		Reply.findOne({'time':id},{'isDe':false}).then((data) => {
			callback(null,data)
		}).catch((err) => {
			callback(err)
		})
	},
	//通过用户id,查找所有一级回复
	getuser:(id,callback) => {
		Reply.find({'author_id':id}).sort({'time':-1}).populate('article_id').then((data) => {
			callback(null,data)
		}).catch((err) => {
			callback(err)
		})
	}
	
	
	
}

const Reply = mongoose.model('Reply',ReplySchema);

module.exports = Reply;
