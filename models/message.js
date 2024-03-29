var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var schema = new Schema({
	text: { type: String, required: true},
	username: { type: String },
	dateTime: { type : Date, default: Date.now },
	system: { type: Boolean, default: false },
	user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Message', schema);
