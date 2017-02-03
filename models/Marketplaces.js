var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var autoJoinFilters = new mongoose.Schema({
    field:String,
    values:[String]
});

var Marketplaces = new mongoose.Schema({
    name:String,
    active:Boolean,
    description:String,
    full_description:String,
    userApprovalRequired:Boolean,
    faq:String,
    utilPath:String,
    large_image:String,
    small_image:String,
    crowdAdminRequired:Boolean,
    JobPosterRequired:Boolean,
    jobPostAlert:String,
    __v:Number,
    descriptionTemplate:String,
    autoJoinFilters:[autoJoinFilters],
    Location:[String],
    emailForExpired:[String],
    categorySkillFilePath:String,
    emailGuidelines:String,
    autoJoinEnabled:Boolean,
    SystemBaseCode:Boolean,
    MaxResourceRequired: Number,
    marketPlaceType: String,
    supervisorAttachmentRequired: Boolean,
    restrictApplication:Boolean,
    taskCategoryField:Boolean,
    taskCategoryJobFilter:Boolean,
    minTimeRequiredCountry:Boolean,
    IsIndusrySpecilizationFilter:Boolean,
    IsIndustryProficiencyRequired:Boolean,
    toEmailJobExpiration:[String],
    ccEmailJobExpiration:[String]
});


//module.exports.Schema = Marketplaces;

var MarketplaceExp = module.exports = mongoose.model('Marketplaces', Marketplaces);

module.exports.MarketplaceSave = function (firstMarketplace) {
    firstMarketplace.save(function (err, firstMarketplace) {
        if (err) {
            console.log("Could not save");
            return null;
        }
        //console.log(firstMarketplace._id);
        return firstMarketplace;
    });
}

module.exports.firstMarketplaceFindByName = function (Name, callback) {
    return MarketplaceExp.findOne({ 'name': Name }, callback);
}