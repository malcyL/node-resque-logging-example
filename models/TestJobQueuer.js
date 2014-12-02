var AppLogger = require('../lib/logger').ApplicationLogger,
    Resque = require("node-resque"),
    ShortId = require('shortid'),
    config = require('../config');

var TestJobQueuer = function(){};

TestJobQueuer.prototype.queueJob = function(requestId, jobType, callback){
    AppLogger.info("Attempting to queue job.");

    var queue = new Resque.queue({connection: config.resque.connectionDetails}, function(){

        var jobData = {
            'id': ShortId.generate(),
            'requestId': requestId
        };

        queue.enqueue('TestJobQueue', jobType, jobData, function(err){
            AppLogger.info("Job Queued - type: " + jobType + " - id:" + jobData.id);
            if(err) {
                callback(err, jobData.id);
            }
            else {
                callback(null, jobData.id);
            }

        });
    });
};

// Manage exports
module.exports = TestJobQueuer;