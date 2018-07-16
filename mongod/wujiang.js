const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const WujiangSchema = new Schema({
	
})

WujiangSchema.statics = {
	getwujiang:(show,t,callback) => {
		Wujiang.find().skip(t * show).limit(show - 0).then((data) => {
//			console.log(t * show)
//			console.log(show - 0)
			callback(null,data)
		}).catch((err) => {
			callback(err)
		})
	}
}

const Wujiang = mongoose.model('wujiang',WujiangSchema);
module.exports = Wujiang;
