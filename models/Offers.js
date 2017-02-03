var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Offers = new mongoose.Schema({
  SL_id:{
        type: Schema.ObjectId
    },
  jobRef: {
    type: Schema.ObjectId,
    ref: 'Jobs'
  },
  talentRef: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  offereddatetime: {
    type: Date
  },
  accepteddatetime: {
    type: Date
  },
  offered: Boolean,
  accepted: Boolean,
  __v:Number,
  FeedBack:String,
  FeedBackTextByApplicant:String,
  HasFeedbackBeenSubmitted:Boolean,
  HasFeedbackBeenSubmittedByApplicant:Boolean,
  rejected: Boolean,
  withdrawn:Boolean,
  withdrawnDateTime:Date
  //offered, accepted, rejected
});

//module.exports.Schema = Offers;

var OfferExp = module.exports = mongoose.model('Offers', Offers);

/*
module.exports.offerSave = function (firstOffer) {
    firstOffer.save(function (err, firstOffer) {
        if (err) {
            console.log("Could not save");
            return null;
        }
        //console.log(firstOffer._id);
        return firstOffer;
    });
}
*/

module.exports.firstOfferFindByName = function (offered, callback) {
    return OfferExp.findOne({ 'offered': offered }, callback);
}

module.exports.findOfferApplicantJobRef = function (talentRef, callback) {
    return OfferExp.find({ 'talentRef': talentRef }, callback);
}