JobsExp = require('./Jobs');
AppicationExp = require('./applications');
OfferExp = require('./Offers');
UserMktExp = require('./usermarketplaces');

var wait = require('wait.for');

var guser = {};

function getStringValue(Param) {
    return typeof Param === 'undefined' ? '' : Param;
}
function BuildSkills(job, user) {
    var skill = {};
    skill.skill_name = getStringValue(job.skills_sl);
    skill.proficiency_level = "";
    var skills = [];
    skills.push(skill);
    return skills;
}
function BuildTaskInfo(job, user) {
    var skills = BuildSkills(job, user);
    var taskInfo = {};
    taskInfo.task_ciphertext = job._id.toString();
    taskInfo.title = getStringValue(job.summary);
    taskInfo.description = getStringValue(job.description);
    taskInfo.skills = skills;
    taskInfo.duration = getStringValue(job.estimatedhours);
    taskInfo.engagement_type = 'NA'
    taskInfo.task_type = 'NA';
    taskInfo.category = getStringValue(job.category);
    taskInfo.workload = 'NA';
    taskInfo.budget = 'NA';
    taskInfo.posted_date = getStringValue(job.posteddatetime);
    taskInfo.expected_start_date = getStringValue(job.startondatetime);
    taskInfo.expected_end_date = getStringValue(job.finishbydatetime);
    taskInfo.actual_start_date = 'NA';
    taskInfo.actual_end_date = getStringValue(job.completeddatetime);
    taskInfo.preferred_location = getStringValue(job.location);
    taskInfo.status = getStringValue(job.JobStatus);
    taskInfo.additional_skills = 'NA';
    return taskInfo;
}

/*
// SELECT jobRef from offers where talentRef=<applicantId>)
function getJobPostedByUsers(postedByUser, callback) {
    JobsExp.findJobPostedByUsers(postedByUser, function (errJob, postedByUsers) {
        if (errJob) {
            console.log(errJob.message);
            callback(errJob, -1);
        }
        else {
            //console.log(jobrefs);
            if (postedByUsers === null){
                callback(null, null);
            }
            var retValue = [];
            var len = postedByUsers.length;
            for (i = 0; i <len; i++){
                retValue.push(postedByUsers[i].postedByUser);
            }
            callback(null, retValue);
        }
    });
}
*/

// Get count of job posting users based on JobStatus
function getJobCount(user, jobStatus, callback) {
    JobsExp.findJobUserCount(user._id, "JobStatus", jobStatus, function (err, count) {
        if (err) {
            console.log(err.message);
            callback(err, -1);

        }
        else {
            //console.log(count);
            callback(null, count);
        }
    });
}

// Get Sum of offers for job posting users
function getOfferSum(user, offer, callback) {
    JobsExp.findOfferSum(user._id, "$offer", function (err, sum) {
        if (err) {
            console.log(err.message);
            callback(err, -1);

        }
        else {
            if (sum === null)
                sum = 0;
            callback(null, sum);
        }
    });
}

// Get Sum of Estimated Hours (Total Hours)
function getEstimatedHoursSum(user, job, callback) {
    JobsExp.findSumOfEstimatedHours(user._id, "$estimatedhours", function (err, sum) {
        if (err) {
            console.log(err.message);
            callback(err, -1);

        }
        else {
            //console.log(sum);
            callback(null, sum);
        }
    });
}

function BuildTaskPosterInfo(job, user) {
    var taskPosterInfo = {};

    taskPosterInfo.task_poster_ciphertext = getStringValue(job.postedByUser);
    taskPosterInfo.feedback = getStringValue(user.AverageRatingAsPoster);
    taskPosterInfo.country = getStringValue(user.AcnProfile.CountryNm);
    taskPosterInfo.city = getStringValue(user.AcnProfile.MetroCityDescr);
    taskPosterInfo.timezone = getStringValue(user.AcnProfile.GeoRegion);
    taskPosterInfo.tasks_posted = getStringValue(user.NumberofJobsPosted);
    taskPosterInfo.tasks_active = wait.for(getJobCount, user, [/Open.*/g, /Accepted.*/g]);
    taskPosterInfo.tasks_completed = wait.for(getJobCount, user, [/Complete.*/g, /Feedback.*/g]);
    taskPosterInfo.total_hires = wait.for(getOfferSum, user, job);
    taskPosterInfo.total_charge = 'NA';
    taskPosterInfo.total_hours = wait.for(getEstimatedHoursSum, user, job);


    return taskPosterInfo;
}

function BuildApplicantsSkillsCertifications(job, user) {
    var certification = {};

    certification.name = "";
    certification.percentile = "";
    certification.level = "";
    certification.date = "";
    certification.is_pass = "";
    certification.score = "";
    var certifications = [];
    certifications.push(certification);

    return certifications;
}

// total_assignments = SELECT COUNT(_id) FROM jobs where _id IN (SELECT jobRef from offers where talentRef=<applicantId>)
function getApplicantSkills(_id, attribute, callback) {
    UserMktExp.findUniqueUserMktCategories(_id, attribute, function (err, skills) {
        if (err) {
            console.log(err.message);
            callback(err, -1);
        }
        else {
            //console.log(skills);
            callback(null, skills);
        }
    });
}

function BuildApplicantsSkills(job, user, application) {
    var certifications = BuildApplicantsSkillsCertifications(job, user);

    var skill = {};
    skill.skill_name = wait.for(getApplicantSkills, application.applicantRef, "categoriesSkills.text");
    skill.proficiency_level = "";
    skill.certifications = certifications;
    var skills = [];
    skills.push(skill);
    return skills;
}

function BuildTaskRegistration(job, user, application) {
    var taskregistration = {};
    taskregistration.expected_price = "";
    taskregistration.estimated_duration = "";
    taskregistration.registration_date = getStringValue(application.appliedDateTime);
    taskregistration.comments = getStringValue(application.comment);

    //var taskregistrations = [];
    //taskregistrations.push(taskregistration);
    return taskregistration;
}

function BuildEducation(job, user) {
    var education = {};
    education.degree = "";
    education.projects = "";
    education.year_completed = "";

    //var educations = [];
    //educations.push(education);
    return education;
}

function BuildExperience(job, user) {
    var experience = {};
    experience.company = "";
    experience.designation = "";
    experience.start_date = "";
    experience.end_date = "";
    experience.projects = "";

    var experiences = [];
    experiences.push(experience);
    return experiences;
}

function BuildApplicantTask(job, user, application) {
    var taskregistrations = BuildTaskRegistration(job, user, application);
    var taskPosterInfo = BuildTaskPosterInfo(job, user);
    var applicanttask = {};

    applicanttask.task_id = getStringValue(job._id);
    applicanttask.title = getStringValue(job.summary);
    applicanttask.description = getStringValue(job.description);
    applicanttask.skills = "getStringValue(job.skills_sl)";
    applicanttask.actual_duration = "NA";
    applicanttask.duration = getStringValue(job.estimatedhours);
    applicanttask.category = getStringValue(job.category);
    applicanttask.workload = "NA";
    applicanttask.feedback_comment = "NA";
    applicanttask.feedback_score = getStringValue(job.Rating);
    applicanttask.earning = "NA";
    applicanttask.budget = "NA";
    applicanttask.posted_date = getStringValue(job.posteddatetime);
    applicanttask.expected_start_date = getStringValue(job.startondatetime);
    applicanttask.expected_end_date = getStringValue(job.finishbydatetime);
    applicanttask.actual_start_date = "NA";
    applicanttask.actual_end_date = getStringValue(job.completeddatetime);
    applicanttask.task_type = "NA";
    applicanttask.status = getStringValue(job.JobStatus);
    applicanttask.rating = "NA";
    applicanttask.hourly_rate = "NA";
    applicanttask.task_registration_info = taskregistrations;
    applicanttask.task_poster_info = taskPosterInfo;

    var applicanttasks = [];
    applicanttasks.push(applicanttask);
    return applicanttasks;
}

// SELECT jobRef from offers where talentRef=<applicantId>)
function getJobOffers(applicantRef, callback) {
    OfferExp.findOfferApplicantJobRef(applicantRef, function (errOffer, jobrefs) {
        if (errOffer) {
            console.log(errOffer.message);
            callback(errOffer, -1);
        }
        else {
            //console.log(jobrefs);
            if (jobrefs === null) {
                callback(null, null);
            }
            var retValue = [];
            var len = jobrefs.length;
            for (i = 0; i < len; i++) {
                retValue.push(jobrefs[i].jobRef);
            }
            callback(null, retValue);
        }
    });
}

// total_assignments = SELECT COUNT(_id) FROM jobs where _id IN (SELECT jobRef from offers where talentRef=<applicantId>)
function getTotalAssignmentCount(job_id, callback) {
    JobsExp.findJobCount(job_id, function (err, count) {
        if (err) {
            console.log(err.message);
            callback(err, -1);
        }
        else {
            //console.log(jobrefs);
            callback(null, count);
        }
    });
}

// SELECT count(_id) FROM jobs where _id IN (SELECT jobRef from offers where talentRef=<applicantId>) and JobStatus IN ('*')
function getAssignmentCount(job_id, attibValue, callback) {
    JobsExp.findApplicantJobCount(job_id, "JobStatus", attibValue, function (err, count) {
        if (err) {
            console.log(err.message);
            callback(err, -1);
        }
        else {
            //console.log(jobrefs);
            callback(null, count);
        }
    });
}

// Get Sum of Estimated Hours (Total Hours) for applicants
function getTotalDuration(_ids, atribValue, callback) {
    JobsExp.findSumOfApplicantEstimatedHours(_ids, "$estimatedhours", atribValue, function (err, sum) {
        if (err) {
            //console.log(err.message);
            callback(err, -1);

        }
        else {
            //console.log(sum);
            callback(null, sum);
        }
    });
}

// Get ApplicantUser
function getApplicantUser(User_id, callback) {
    UserExp.UserFindByPostedByUser(User_id, function (err, AppUser) {
        if (err) {
            console.log(err.message);
            callback(err, -1);

        }
        else {
            //console.log(AppUser);
            callback(null, AppUser);
        }
    });
}

// Get Top Rating for applicants
function getTopApplicantRating(_ids, attibValue, callback) {
    JobsExp.findTopJobRating(_ids, attibValue, function (err, rating) {
        if (err) {
            console.log(err.message);
            callback(err, -1);

        }
        else {
            //console.log(rating[0]);
            if (rating === null || rating.length === 0)
                callback(err, 0);
            else
                callback(null, rating[0].Rating);
        }
    });
}

function RefineApplicants(job, application) {
    var AppUser = wait.for(getApplicantUser, application.applicantRef);
    var jobrefs = wait.for(getJobOffers, application.applicantRef);
    //console.log(jobrefs);

    var skills = BuildApplicantsSkills(job, AppUser, application);
    var taskregistrations = BuildTaskRegistration(job, AppUser, application);
    var educations = BuildEducation(job, AppUser);
    var experiences = BuildExperience(job, AppUser);
    var applicanttasks = BuildApplicantTask(job, AppUser, application);

    var applicants = {};

    applicants.worker_id = getStringValue(AppUser._id);
    applicants.worker_name = getStringValue(AppUser.AcnProfile.Name);
    applicants.rating = getStringValue(AppUser.AverageRating);
    applicants.completed_assignments = wait.for(getAssignmentCount, jobrefs, [/Complete.*/g, /Feedback.*/g]);
    applicants.total_assignments = wait.for(getTotalAssignmentCount, jobrefs);
    applicants.hourly_rate = 'NA';
    applicants.active_assignments = wait.for(getAssignmentCount, jobrefs, [/Open.*/g, /Accepted.*/g]);
    applicants.address = 'NA';
    applicants.contact = 'NA';
    applicants.gender = 'NA';
    applicants.skills = skills;
    applicants.total_duration = wait.for(getTotalDuration, jobrefs, [/Complete.*/g, /Feedback.*/g]);
    applicants.recent_rating = wait.for(getTopApplicantRating, jobrefs, "completeddatetime");;
    applicants.profile_title = 'NA';
    applicants.profile_overview = 'NA';
    applicants.country = getStringValue(AppUser.AcnProfile.CountryNm);
    applicants.city = getStringValue(AppUser.AcnProfile.MetroCityDescr);
    applicants.timezone = getStringValue(AppUser.AcnProfile.GeoRegion);
    applicants.emailId = getStringValue(AppUser.AcnProfile.Email);
    applicants.offer_rejected = getStringValue(AppUser.NumOfOfferRejections);
    applicants.profile_img = 'NA';
    applicants.task_registration_info = taskregistrations;
    applicants.education = educations;
    applicants.experience = experiences;
    applicants.applicant_tasks = applicanttasks;

    return applicants;
}

function BuildApplicants(job, user, application) {
    //console.log(job.applications);
    var applicants = [];
    job.applications.forEach(function (element) {
        if (typeof element.withdrawn !== 'undefined') {
            if (element.withdrawn === false) {
                applicants.push(RefineApplicants(job, element));
            }
        }

    }, this);
    return (applicants);
}
// Get the application details for the specific job id
function getApplication(jobid, callback) {
    AppicationExp.findApplicationbyID(jobid, function (err, application) {
        if (err) {
            console.log(err.message);
            callback(err, -1);

        }
        else {
            //console.log(application);
            callback(null, application);
        }
    });
}



function BuildPostedTask(job, user, req, res) {
    var application = wait.for(getApplication, job._id);

    var taskInfo = BuildTaskInfo(job, user);
    var taskPosterInfo = BuildTaskPosterInfo(job, user);
    var applicants = BuildApplicants(job, user, application);

    var postedTask = {};
    postedTask.posted_task = {};
    postedTask.posted_task.task_info = taskInfo;
    postedTask.posted_task.task_poster_info = taskPosterInfo;
    postedTask.posted_task.applicants = applicants;
    res.status = 200;
    res.json(postedTask);
    return;
}


module.exports = exports = function (job, user, req, res) {
    wait.launchFiber(BuildPostedTask, job, user, req, res);
}

