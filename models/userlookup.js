var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var schema = new Schema({
	username: {type: String, required: true},
	clientId: {type: String, required: true}
});

module.exports = mongoose.model('UserLookupSchema', schema);
