var mongoose = require('mongoose');


var fsfile = new mongoose.Schema({
    filename: String,
    contentType: String,
    length: Number,
    chunkSize: Number,
    uploadDate: Date,
    aliases: String,
    metadata: String,
    md5: String
});

//var FsFiles = mongoose.model('fsfile', fsfile);

var FsFiles = module.exports=mongoose.model('fsfile', fsfile);

module.exports.firstFileSave = function(firstFile){
    firstFile.save(function (err, firstFile) {
    if (err) {
        console.log("Could not save");
        return null;
    }
    //console.log(firstFile._id);
    return firstFile;
});
} 

module.exports.firstFileFindByFileName = function(filename,callback){
    return FsFiles.findOne({'filename':filename},callback);
}