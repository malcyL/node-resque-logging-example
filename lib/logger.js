var domain = require('domain');

var winston = require('winston'),
    config = require('../config'),
    myCustomLogLevels = {
        levels: {
            access: 0,
            trace: 1,
            debug: 2,
            info: 3,
            warn: 4,
            error: 5
        },
        colors: {
            access: 'inverse',
            trace: 'white',
            debug: 'blue',
            info: 'green',
            warn: 'yellow',
            error: 'red'
        }
    };

///////////// Setup Access Logger
/**
 * accessLoggerTransports
 *
 * ALWAYS log to file.
 * If running in development mode, then and only then, log to console as well
 * @type {Array}
 */
var accessLoggerTransports = [];
if (config.env === 'development') {
    accessLoggerTransports.push(new(winston.transports.Console)({
        json: false,
        timestamp: true,
        colorize: true,
        level: 'access'
    }));
}
accessLoggerTransports.push(new(winston.transports.File)({
    json: false,
    timestamp: true,
    filename: config.logging.access_log,
    level: 'access'
}));

/**
 * Only use for logging access requests
 * @type {winston.Logger}
 */
var accessLogger = new(winston.Logger)({
    levels: myCustomLogLevels.levels,
    transports: accessLoggerTransports
});

///////////// Setup Application Logger
/**
 * applicationLoggerTransports
 *
 * ALWAYS log to file.
 * If running in development mode, then and only then, log to console as well
 * @type {Array}
 */
var applicationLoggerTransports = [];
if (config.env === 'development') {
    applicationLoggerTransports.push(new(winston.transports.Console)({
        json: false,
        timestamp: true,
        colorize: true,
        level: config.logging.log_level
    }));
}
applicationLoggerTransports.push(new(winston.transports.File)({
    json: false,
    timestamp: true,
    filename: config.logging.app_log,
    level: config.logging.log_level
}));

/**
 * Use this for all other application + logging
 * @type {winston.Logger}
 */
var applicationLogger = new(winston.Logger)({
    levels: myCustomLogLevels.levels,
    transports: applicationLoggerTransports,
    exceptionHandlers: [
        new winston.transports.File({
            json: false,
            timestamp: true,
            prettyPrint: true,
            filename: config.logging.app_log,
            handleExceptions: true
        })
    ]
});

///////////// Setup Background Logger
/**
 * backgroundLoggerTransports
 *
 * ALWAYS log to file.
 * If running in development mode, then and only then, log to console as well
 * @type {Array}
 */
var backgroundLoggerTransports = [];
if (config.env === 'development') {
    backgroundLoggerTransports.push(new(winston.transports.Console)({
        json: false,
        timestamp: true,
        colorize: true,
        level: config.logging.log_level
    }));
}
backgroundLoggerTransports.push(new(winston.transports.File)({
    json: false,
    timestamp: true,
    filename: config.logging.bg_log,
    level: config.logging.log_level
}));

/**
 * Use this for all other application + logging
 * @type {winston.Logger}
 */
var backgroundLogger = new(winston.Logger)({
    levels: myCustomLogLevels.levels,
    transports: backgroundLoggerTransports,
    exceptionHandlers: [
        new winston.transports.File({
            json: false,
            timestamp: true,
            prettyPrint: true,
            filename: config.logging.app_log,
            handleExceptions: true
        })
    ]
});

///////////// Add Uid into each logger

var logUid = function(){
    var args = arguments;
    if(process.domain && process.domain._request_uid)
    {
        args[1] = process.domain._request_uid + ": " + args[1];
    }
    winston.Logger.prototype.log.apply(this,args);
};

accessLogger.log = logUid
applicationLogger.log = logUid
backgroundLogger.log = logUid

var storeRequestUid = function(req_uid) {
    req_uid = req_uid ? req_uid :  guid();
    var reqd = domain.create();
    reqd._request_uid = req_uid;
    process.domain = reqd;
}

var clearRequestUid = function() {
    var reqd = domain.create();
    process.domain = reqd;
}

var getRequestUid = function() {
    return process.domain._request_uid
}

var guid = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function() {
    return s4() + s4();
  };
})();

winston.addColors(myCustomLogLevels.colors);
module.exports.AccessLogger = accessLogger;
module.exports.ApplicationLogger = applicationLogger;
module.exports.BackgroundLogger = backgroundLogger;
module.exports.StoreRequestUid = storeRequestUid;
module.exports.ClearRequestUid = clearRequestUid;
module.exports.GetRequestUid = getRequestUid;
