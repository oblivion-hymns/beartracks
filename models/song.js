var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var schema = new Schema({
	name: {type: String, required: true},
	nameKey: {type: String, required: true, unique: true},
	length: {type: String},
	genre: {type: String, required: true},
	artist: {type: Schema.Types.ObjectId, ref: 'Artist', required: true},
	album: {type: Schema.Types.ObjectId, ref: 'Album', required: true},
	discNum: {type: Number, required: true},
	trackNum: {type: Number, required: true}
});

module.exports = mongoose.model('Song', schema);
