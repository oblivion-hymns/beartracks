var mongoose = require('mongoose');
var mongooseTimestamps = require('mongoose-timestamp');

var Schema = mongoose.Schema;
var schema = new Schema({
	name: {type: String, required: true},
	nameKey: {type: String, required: true, unique: true},
	album: {type: Schema.Types.ObjectId, ref: 'Album', required: true},
	discNum: {type: Number, required: true},
	trackNum: {type: Number, required: true},
	genre: {type: String, required: true},
	filePath: {type: String, required: true},
	length: {type: String},
	playCount: {type: Number, required: true, default: 0}
});
schema.plugin(mongooseTimestamps);

module.exports = mongoose.model('Track', schema);
