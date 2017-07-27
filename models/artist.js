var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var schema = new Schema({
	name: {type: String, required: true},
	nameKey: {type: String, required: true, unique: true},
	imagePath: {type: String}
});
schema.index({"name": "text"});

module.exports = mongoose.model('Artist', schema);
