const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const AdminSchema = new Schema({
	adminName:{
		type:String,
	},
	adminPas:{
		type:String,
	}
	
})

AdminSchema.statics = {
	//通过用户名查找该管理员是否存在
	admingetname:(id,callback) => {
		Admin.findOne({'adminName':id}).then((data) => {
			callback(null,data)
		}).catch((err) => {
			callback(err)
		})
	},
}

const Admin = mongoose.model('admin',AdminSchema);
module.exports = Admin;
