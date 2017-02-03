var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var applications = new mongoose.Schema({
    SL_id: { type: Schema.ObjectId },
    jobRef: { type: Schema.ObjectId },
    applicantRef: { type: Schema.ObjectId },
    comment: String,
    applied: Boolean,
    appliedDateTime: Date
});


var AppicationExp = module.exports=mongoose.model('applications', applications);


module.exports.findApplicationbyID = function(job_id, callback){
    return AppicationExp.findOne({'jobRef': job_id}, callback);
}

