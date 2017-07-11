var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var schema = new Schema({
	message: {type: String, required: true},
	username: {type: String}
});

module.exports = mongoose.model('Message', schema);
