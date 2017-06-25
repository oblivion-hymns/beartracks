var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var schema = new Schema({
	name: {type: String, required: true},
	nameKey: {type: String, required: true},
	imagePath: {type: String}
});

module.exports = mongoose.model('Artist', schema);
