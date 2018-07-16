const mongoose = require('mongoose');
const db = require('./db');
const Schema = mongoose.Schema;
//导入设置时间差模块
const moment = require('moment');
//设置全局语言 -- 使用中文
moment.locale('zh-cn');

const ArticleSchema = new Schema({
	//标题
	title:{
		type:String,
		require:true,
	},
	//文章类型
	type:{
		type:String,
	},
	//文章内容
	content:{
		type:String,
		require:true,
	},
	//文章创建时间
	times:{
		type:Date,
		default:Date.now,
		require:true,
	},
	//是否置顶
	top:{
		type:Boolean,
	},
	//置顶等级
	top_z_index:{
		type:Number,
	},
	//author(该文章的作者)
	author:{
		type:String,
		require:true,
		ref:'user',
	},
	//图片
	img:{
		type:String,
	},
	//点击数量(浏览数量)
	looks_num:{
		type:Number,
		default:0,
	},
	//回复数量
	reply_num:{
		type:Number,
		default:0,
	},
	//点赞次数
	like_num:{
		type:Number,
		default:0,
	},
	//关注
	pay_num:{
		type:Number,
		default:0,
	},
	//最后回复的人
	last_user:{
		type:String,
		ref:'user',
	},
	//最后回复的内容
	last_content:{
		type:String,
	},
	//最后回复的时间（以此排序）
	last_time:{
		type:Date,
		default:Date.now,
		require:true,
	},
	//是否删除
	isDe:{
		type:Boolean,
		default:false,
	}
})

ArticleSchema.statics = {
	//通过时间查询文章
	getTime:(id,callback) => {
		Article.findOne({'times':id},{'isDe':false}).then((data) => {
			callback(null,data)
		}).catch((err) => {
			callback(err)
		})
	},
	//通过作者查询文章
	getUser:(id,callback) => {
		Article.find({'author':id},{'isDe':false}).then((data) => {
			callback(null,data)
		}).catch((err) => {
			callback(err)
		})
	}
}


ArticleSchema.methods.create_time_ago = function(){
	let time = moment(this.times).fromNow();
	return time;
}

const Article = mongoose.model('Article',ArticleSchema);

module.exports = Article;




