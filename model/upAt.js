const Message = require('../mongod/Message');
const saveMessage = {
	//普通文章@
	//谁@你..某个文章id,被@的人
	At:function(use_id,article_id,at_id){
		var data = new Message();
		console.log('产生通知消息')
		//谁@你..
		data.use_at = use_id
		//某个文章中
		data.article_id = article_id
		//被@的人
		data.at_user = at_id;
		data.type = 'AT';
		data.save()
	},
	//回复中@
	//谁@你,文章id,被@的人,一级回复的那个id,二级回复的id,该回复的内容
	ReplyAt:function(use_id,article_id,at_id,reply_id,comment_id,content){
		var data = new Message();
		console.log('产生通知消息')
		//谁@你..
		data.use_at = use_id
		//某个文章中
		data.article_id = article_id
		//被@的人
		data.at_user = at_id;
		//一级回复的id
		data.reply_id = reply_id
		//如果有二级回复的id
		if( comment_id ){
			data.comment_id = comment_id
		}
		//回复的内容
		data.reply_content = content
		data.type = 'ReplyAT';
		data.save();
	},
	//一级回复或者多级回复
	//谁,某篇文章,文章作者id(也就是被回复的人),一级回复的id,二级回复的id,该回复的内容
	Reply:function(use_id,article_id,author_id,reply_id,comment_id,content){
		var data = new Message();
		console.log('产生通知消息')
		//谁..
		data.use_at = use_id
		//某个文章中
		data.article_id = article_id
		//作者id
		data.at_user = author_id;
		//一级回复的id
		data.reply_id = reply_id
		//如果有二级回复的id
		if( comment_id ){
			data.comment_id = comment_id
		}
		//回复的内容
		data.reply_content = content
		data.type = 'Reply';
		data.save()
	}
}
module.exports = saveMessage;
