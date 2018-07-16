//系统消息
const Admininfo = require('../mongod/adminInfo');
const User = require('../mongod/user');

const saveAdmininfo = {
	//好友请求
	//谁发送的请求,接受者
	getask:(use_id,at_id) => {
		var data = new Admininfo()
		//设置消息类型
		data.type = 'user';
		//设置用户消息类型
		data.user_type = 'user-ask';
		//设置发送人
		data.use_id = use_id;
		//设置内容
		data.content = '请求加您为好友';
		//设置接收人
		data.at_id = at_id;
		data.save()
	},
	//同意好友的请求
	//谁同意了你的好友请求
	getyesadd:(use_id,at_id) => {
		var data = new Admininfo()
		//设置消息类型
		data.type = 'user';
		//设置用户消息类型
		data.user_type = 'user-yes';
		//设置发送人
		data.use_id = use_id;
		//设置内容
		data.content = '同意了您的好友请求';
		//设置接收人
		data.at_id = at_id;
		data.save()
	},
	//拒绝了好友请求
	getnoadd:(use_id,at_id) => {
		var data = new Admininfo()
		//设置消息类型
		data.type = 'user';
		//设置用户消息类型
		data.user_type = 'user-no';
		//设置发送人
		data.use_id = use_id;
		//设置内容
		data.content = '拒绝了您的好友请求';
		//设置接收人
		data.at_id = at_id;
		//设置已经已读
//		data.has_look = true;
////	`	拒绝请求
//		data.add_ask = 'no';
//		console.log(data)
		data.save()
	},
}

module.exports = saveAdmininfo