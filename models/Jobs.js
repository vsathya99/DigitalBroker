var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var applications = new mongoose.Schema({
    jobRef: {
        type: Schema.ObjectId,
        ref: 'Jobs'
    },
    applicantRef: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    comment: String,
    appliedDateTime: Date,
    applied: Boolean,
    CountryBackgroundAffirmation: Boolean,
    withdrawn: Boolean,
    __v: Number,
    SL_id: { type: Schema.ObjectId },
    withdrawnDateTime: Date
});

var Applications = mongoose.model('Applications', applications);


var languages = new mongoose.Schema({
    name: String,
    proficiency: String
});

var skills = new mongoose.Schema({
    name: String,
    proficiency: String,
    category: String,
    categoryName: String
});

var industrySpecialization = new mongoose.Schema({
    text: String
});



var jobs = new mongoose.Schema({
    SL_id: {
        type: Schema.ObjectId
    },
    summary: String,
    clientorprojectname: String,
    startondatetime: String,
    finishbydatetime: String,
    expirebydatetime: Date,
    marketplace: {
        type: Schema.ObjectId,
        ref: 'Marketplaces'
    },
    opportunityId: String,
    opportunity: { type: Schema.ObjectId },
    estimatedhours: Number,
    location: String,
    address: String,
    description: String,
    postedby: String,
    postedByUser: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    delegatename: String,
    delegateemail: String,
    category: String,
    JobStatus: String,
    urgency: Number,
    ChargeableWBS: String,
    skills_sl: String,
    postdatetime: Date,
    completed: Boolean,
    completeddatetime: Date,
    offered: Boolean,
    offeredAt: Date,
    RatingByApplicant: Number,
    Rating: Number,
    Languages: [languages],
    OtherSkills: [String],
    applicationsLen: String,
    applications: [applications],
    Attachments: [{
        FileNameInDB: String,
        FileName: String,
        FileID: {
            type: Schema.ObjectId,
            ref: 'fsfiles'
        }
    }],
    TargetedCrowdName: [String],
    OfferingSpecialization: [String],
    IndustrySpecialization: [industrySpecialization],
    SpeedToMobilize: [String],
    talentlevel: [String],
    skills: [skills],
    __v: Number,
    IsMultiOfferJob: Boolean,
    ResourcesRequired: Number,
    AcceptedOffers: Number,
    feedbacksubmittedbypostercount: Number,
    feedbacksubmittedbyapplicantcount: Number,
    offer: [
        {
            type: Schema.ObjectId,
            ref: 'Offers'
        }


    ],
    skillsForEmail: [{
        value: String,
        category: String
    }
    ],
    deleted: Boolean,
    HasFeedbackBeenSubmittedByApplicant: Boolean,
    HasFeedbackBeenSubmitted: Boolean,
    FeedBack: String,
    FeedBackTextByApplicant: String,
    lastediteddatetime: Date,
    closedByAdmin: Boolean,
    withdrawnReason: String,
    jobWithdrawnDateTime: Date,
    jobWithdrawnBy: String,
    jobWithdrawn: Boolean,
    jobDeletedBy: String,
    jobDeletedDateTime: Date,
    OtherSkillSet: String,
    Language: String,
    flaggedDateTime: Date,
    flaggedBy: String,
    flagged: Boolean,
    client: String,
    LanguageFilterOption: String,
    OrganizationUnit: [String],
    talentlocation: [String],
    talentsegmentDesc: [String],
    jobDeletedReason: String
});

/*
module.exports = {
  Applications: Applications,
  Jobs: Jobs,
};*/

var JobsExp = module.exports = mongoose.model('Jobs', jobs);

module.exports.jobSave = function (firstJob) {
    firstJob.save(function (err, firstJob) {
        if (err) {
            console.log("Could not save");
            return null;
        }
        //console.log(firstJob._id);
        return firstJob;
    });
}

module.exports.firstJobFindByName = function (opportunityId, callback) {
    return JobsExp.findOne({ 'opportunityId': opportunityId }, callback);
}

module.exports.jobFindById = function (_id, callback) {
    return JobsExp.findById({ '_id': _id }, callback);
}

module.exports.findJobPostedByUsers = function (postedByUser, callback) {
    return JobsExp.find({ 'postedByUser': postedByUser }, callback);
}

module.exports.findJobUserCount = function (postedByUser, attribute, attibValue, callback) {
    //console.log(postedByUser);
    return JobsExp.where('postedByUser').equals(postedByUser).
        where(attribute).in(attibValue).
        count(callback);
}

module.exports.findApplicantJobCount = function (_id, attribute, attibValue, callback) {
    //console.log(postedByUser);
    return JobsExp.where('_id').in(_id).
        where(attribute).in(attibValue).
        count(callback);
}

module.exports.findJobCount = function (_id, callback) {
    //console.log(postedByUser);
    return JobsExp.where('_id').in(_id).
        count(callback);
}

module.exports.findOfferSum = function (postedByUser, attribute, callback) {
    JobsExp.aggregate([
        {
            $match: {
                'postedByUser': postedByUser,
                'offer': { $ne: null }
            }
        },
        {
            $project:
            {
                offer:
                { $size: attribute }

            }
        },
        {
            $group: {
                _id: 'postedByUser',
                balance: { $sum: attribute }
            }
        }
    ],
        function (err, result) {
            if (result.length != 0)
                callback(err, result[0].balance);
            else
                callback(err, null);
        });
}

module.exports.findSumOfEstimatedHours = function (postedByUser, attribute, callback) {
    JobsExp.aggregate([
        {
            $match: {
                'postedByUser': postedByUser
            }
        },
        {
            $group: {
                _id: 'postedByUser',
                balance: { $sum: attribute }
            }
        }
    ],
        function (err, result) {
            if (result === null || result.length === 0)
                callback(err, 0);
            else
                callback(err, result[0].balance);
        });
}

module.exports.findSumOfApplicantEstimatedHours = function (_ids, attribute, attribValue, callback) {
    JobsExp.aggregate([
        {
            $match: {
                '_id': { $in: _ids },
                'JobStatus': { $in: attribValue }
            }
        },
        {
            $group: {
                _id: null,
                balance: { $sum: attribute }
            }
        }
    ],
        function (err, result) {
            if (result === null || result.length === 0)
                callback(err, 0);
            else
                callback(err, result[0].balance);
        });
}

module.exports.findTopJobRating = function (_ids, attribute, callback) {
    return JobsExp.where('_id').in(_ids).
        sort({ attribute: -1 }).
        limit(1).
        exec(callback);
}
