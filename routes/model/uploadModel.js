var fs = require('fs');
var mongoose = require('mongoose');
var db = mongoose.connection;
// console.log(db);
var gridfs = require('./gridfs');
var Schema = mongoose.Schema;

var uploadSchema = mongoose.Schema(
    {
        _id : Schema.Types.ObjectId,
        docName: 'string',
        files: [ mongoose.Schema.Mixed ]
    }
);

uploadSchema.methods.addFile = function(file, options, fn) {
    var upload;
    upload = this;
    //console.log('Path of File:: '+file.path)
    //console.log('Name of File:: '+file.name)
    return gridfs.putGridFileByPath(file.path, file.name, options, function(err, result) {
        if (err) console.log("UploadModel Upload Error: " + err);

        upload.files.push(result);
        return upload.save(fn);
    });
};

var uploads = mongoose.model("upload", uploadSchema);

module.exports = uploads;