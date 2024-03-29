var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var schema = new Schema({
	name: {type: String, required: true},
	nameKey: {type: String, required: true, unique: true},
	year: {type: Number, required: true},
	artist: {type: Schema.Types.ObjectId, ref: 'Artist', required: true},
	imagePath: {type: String}
});
schema.index({'name': 'text'});

module.exports = mongoose.model('Album', schema);
