var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');

var port = 3000;

//Mongodb connection

mongoose.connect('mongodb://192.168.1.115:27017/alw');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//Collections

FsFile = require('./models/fsfile');

UserExp = require('./models/User');

JobsExp = require('./models/Jobs');

BuildAAResponse = require('./models/aaResponse');


function FetchUserData(jobId, waitFlg) {
    waitFlg = true;
    JobsExp.jobFindById(jobId, function (err, job) {
        if (err) {
            console.log("Error fetching data from Jobs");
            console.log(err.message);
            return null;
        }
        UserExp.UserFindByPostedByUser(job.postedByUser, function (errUsr, user) {
            if (errUsr) {
                console.log("Error fetching data from User");
                console.log(errUsr.message);
                waitFlg = false;
                return null;
            }
            var retValue;
            retValue.job = job;
            retValue.user = user;
            waitFlg = false;
            return retValue;
        });
    });
}


app.get('/api/jobs/:_id', function (req, res) {
    JobsExp.jobFindById(req.params._id, function (err, job) {
        if (err) {
            console.log("Error fetching data from Jobs");
            console.log(err.message);
            res.status = 404;
            res.json("");
        }
        UserExp.UserFindByPostedByUser(job.postedByUser, function (errUsr, user) {
            if (errUsr) {
                console.log("Error fetching data from User");
                console.log(errUsr.message);
                res.status = 404;
                res.json("");
            }
            var reqResponse = BuildAAResponse(job, user, req, res); 
        });
    });
});

app.listen(port);
console.log('Running on port 3000');