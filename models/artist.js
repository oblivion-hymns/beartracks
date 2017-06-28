var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var schema = new Schema({
	name: {type: String, required: true},
	nameKey: {type: String, required: true, unique: true},
	albums: {type: Schema.Types.ObjectId, ref: 'Album'},
	imagePath: {type: String}
});

module.exports = mongoose.model('Artist', schema);
