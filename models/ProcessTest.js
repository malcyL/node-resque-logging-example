var AppLogger = require('../lib/logger').ApplicationLogger;
var storeRequestUid = require('../lib/logger').StoreRequestUid;
var clearRequestUid = require('../lib/logger').ClearRequestUid;

var ProcessTest = {};

ProcessTest.process = function(jobData, callback){
    storeRequestUid(jobData.requestId);
    AppLogger.debug('ProcessTest - Starting Processing');
    AppLogger.debug('Finished processing');
    clearRequestUid();
    callback(null);
};

// Manage exports
module.exports = ProcessTest;