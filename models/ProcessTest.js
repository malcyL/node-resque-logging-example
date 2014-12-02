var AppLogger = require('../lib/logger').BackgroundLogger;
var storeRequestUid = require('../lib/logger').StoreRequestUid;
var clearRequestUid = require('../lib/logger').ClearRequestUid;

var ProcessTest = {};

ProcessTest.process = function(jobData, callback){
    storeRequestUid(jobData.requestId);
    AppLogger.info('ProcessTest - Starting Processing');
    AppLogger.info('Finished processing');
    clearRequestUid();
    callback(null);
};

// Manage exports
module.exports = ProcessTest;