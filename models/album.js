var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var schema = new Schema({
	name: {type: String, required: true},
	nameKey: {type: String, required: true},
	year: {type: Number, required: true},
	artist: {type: Schema.Types.ObjectId, ref: 'Artist', required: true},
	songs: {type: Schema.Types.ObjectId, ref: 'Song', required: true},
	imagePath: {type: String},
});

module.exports = mongoose.model('Artist', schema);
