var config = require('./config'),
    id = process.pid,
    AppLogger = require('./lib/logger').BackgroundLogger,
    Resque = require("node-resque"),
    TestProcessor = require('./models/ProcessTest'),
    jobs = {
        "test":{
            perform: function(jobData, done){
                AppLogger.info("[WORKER " + id + " Starting test job: " + jobData.id+"]");
                TestProcessor.process(jobData, function(){
                    AppLogger.info("[WORKER " + id + " Completed test job: " + jobData.id+"]");
                    done(null);
                });
            }
        }
    };



// Start a new worker
AppLogger.info("Starting Worker: " + id);
var worker = new Resque.worker({connection: config.resque.connectionDetails,  queues: ['TestJobQueue'], 'name': id }, jobs, function () {
    worker.on('start', function(){
        AppLogger.info("[WORKER "+id+" Worker Started]");
    });
    worker.workerCleanup(function(){
        worker.start();
    });

});


// some global event listeners
//
// Triggered every time the Worker polls.


worker.on('poll', function (queue) { // jshint ignore:line
    AppLogger.info("[WORKER "+id+" Polling...]");
});

// Triggered before a Job is attempted.
worker.on('job', function (queue, job) {
    AppLogger.info("[WORKER "+id+" Picking up job: " + JSON.stringify(job));
});

// Triggered every time a Job errors.
worker.on('error', function (queue, job, error) {
    AppLogger.error("[WORKER "+id+" Error: " + error + " with job: " + JSON.stringify(job)+"]");
    AppLogger.error(error.stack);
});

// Triggered on every successful Job run.
worker.on('success', function (queue, job, result) { // jshint ignore:line
    AppLogger.info("[WORKER "+id+" Success!]");
    //    AppLogger.info("[WORKER "+id+"] Success: "+JSON.stringify(result)+" with job: "+JSON.stringify(job));
});

// On a SIGTERM event
process.on('SIGTERM', function () {
    AppLogger.info("[WORKER "+id+" Sigterm event - Attempting to exit, carefully]");
    process.exit();
});

// On a SIGTERM event
process.on('SIGINT', function () {
    AppLogger.info("[WORKER "+id+" Sigint event - Attempting to exit, carefully]");
    process.exit();
});

// On an exit event
// Do not use callbacks here as they will not be called
process.on('exit', function () {
    AppLogger.info("[WORKER "+id+" Exit event - Gracefully shutting down worker]");
    worker.end();
    AppLogger.info("[WORKER "+id+" Worker closed - goodbye, and thanks for all the fish!]");
});

// On an uncaught exception event
process.on('uncaughtException', function(err) {
    console.log(err.stack);
    throw err;
});