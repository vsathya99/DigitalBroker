var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usermarketplaces = new mongoose.Schema({
    userRef:{
        type: Schema.ObjectId,
        ref: 'User'
    },
    name:String,
    active:Boolean,
    userApprovalRequired:Boolean,
    marketPlaceRef:{
        type: Schema.ObjectId,
        ref: 'Marketplaces'
    },
    marketPlaceAdminApproved:Boolean,
    crowdAdmin:Boolean,
    marketPlaceAdmin:Boolean,
    language:[{
            "name" : String,
            "text" : String,
            "proficiency" : String,
            "approved" : Boolean,
            "_id" : Schema.ObjectId
        }],
    careerLevel:[String],
    locations:[String],
    AvgRatingAsApplicant:Number,
    AvgRatingAsPoster:Number,
    userApproved:Boolean,
    categoriesSkills:[{
        name:String,
        text:String,
        proficiency: String,
        category: String,
        approved:Boolean
    }],
    __v:Number,
    settings:{
        onBench:Boolean,
        notifications: 
        {
            allposts:Boolean,
            myposts:Boolean
        }
    },
    userDeleted:Boolean,
    username:String,
    PeopleKey:String,
    OrgUnitDescr:String,
    SupervisorNm:String,
    TalentSegmentDescr:String,
    supervisorEmailForApproval:String,
    MRDRUpdate:
    {
        UpdateProcess:String,
        UpdateDate:Date,
        Key:String,
        Status:Boolean
    },
    mobilityFlexibility:String,
    mobilizeSpeed:String
});


var UserMktExp = module.exports=mongoose.model('usermarketplaces', usermarketplaces);


module.exports.findUniqueUserMktCategories = function(_id, attribute, callback){
     return UserMktExp.distinct(attribute, {'userRef' : _id}).
        exec(callback);
}