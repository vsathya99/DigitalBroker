var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var language = new mongoose.Schema({
    name: String,
    text: String,
    proficiency: String,
    category: String,
    approved: Boolean
});

var User = new mongoose.Schema({
    CVUrl: String,
    ProfileUrl: String,
    username: {
        type: String,
        required: true
    },
    personnelNumber: String,
    Deleted: Boolean,
    Language: [language],
    noCrowdAdminCount: Number,
    crowdAdminCount: Number,
    marketPlaceAdminCount: Number,
    supervisees: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    supervisorAdmin: Boolean,
    AverageRatingAsPoster: Number,
    TotalRatingAsPoster: Number,
    NumberofJobsPosted: Number,
    AverageRating: Number,
    TotalRating: Number,
    NumberofProjects: Number,
    systemAdmin: Boolean,
    crowdAdmin: Boolean,
    NumOfOfferRejections: Number,
    __v: Number,
    PeopleKey: String,
    PhotoURL: String,
    CrowdNumber: String,
    joinedLWF: Boolean,
    AcnProfile: {
        EmploymentStatusDescr: String,
        UserObjectDescr: String,
        IndustrySpecialization: String,
        ParentIndustrySpecialization: String,
        CountryNm: String,
        FacilityCd: String,
        FacilityDescr: String,
        FirstName: String,
        MiddleInitial: String,
        LastName: String,
        Name: String,
        GeographicUnitDescr: String,
        Email: {
            type: String,
            validate: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}\b/,
            required: true
        },

        Level: String,
        MetroCityDescr: String,
        RoleFamilyDesc: String,
        SupervisorNm: String,
        Location: String,
        GeoRegion: String,
        TalentSegmentCd: String,
        TalentSegmentDescr: String,
        OrgUnit: {
            OrgUnitDescr: String,
            OrgUnitID: String,
            Level0: String,
            Level1: String,
            Level2: String,
            Level3: String,
            Level4: String,
            Level5: String,
            Level6: String,
            Level7: String,
            Level8: String,
            Level9: String,
            Level10: String,
            Level11: String
        },

        UserObjectcd: String,
        CountryKey: String,
        MetroCityCd: String,
        GeographicUnitCd: String
    },
    DeletedBy: String,
    DeletedAt: String,
    DeletedReason: String,
    LastLogin: Date,
    MRDRUpdate: {
        UpdateProcess: String,
        UpdateDate: Date,
        Key: String,
        Status: Boolean
    },
    PlatformAdmin: Boolean

});


var UserExp = module.exports = mongoose.model('User', User);

module.exports.userSave = function (firstUser) {
    firstUser.save(function (err, firstUser) {
        if (err) {
            console.log("Could not save");
            return null;
        }
        //console.log(firstUser._id);
        return firstUser;
    });
}

module.exports.firstUserFindByName = function (AcnName, callback) {
    return UserExp.findOne({ 'AcnProfile.Name': AcnName }, callback);
}

module.exports.UserFindByPostedByUser = function (_id, callback) {
    return UserExp.findById({ '_id': _id }, callback);
}