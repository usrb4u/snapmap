var mongoose = require('mongoose');

var mapinfoSchema = mongoose.Schema({
	latitude:String,
	longitude:String,
	title:String,
	info:String,
	imageId:String,
	imagecount:String,
	date:String
});

var mapinfo = mongoose.model('mapinfo',mapinfoSchema);

module.exports = mapinfo;