var AppLogger = require('../lib/logger').ApplicationLogger;
var storeRequestUid = require('../lib/logger').SroreRequestUid;

/**
 * Define routes for test v1
 *
 * @param app
 */
module.exports = function (app) {
    /**
     * Route status
     */
    app.route('/1/status')
        .get(function(req, res){
            storeRequestUid(req.headers['x-talis-request-id']);
            AppLogger.info('Returning status: alive');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ status: 'alive' }));        	
        });

    app.route('/1/doSomething')
        .get(function(req, res){
            storeRequestUid(req.headers['x-talis-request-id']);
            AppLogger.info('Starting to do something....');
            AppLogger.info('  something 1....');
            AppLogger.info('  something 2....');
            setTimeout(doSomethingLater,2000);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ status: 'Started' }));           
        });
};

function doSomethingLater() {
    if (Math.floor((Math.random() * 10) + 1) < 9) {
        AppLogger.info('  something 3....');
        AppLogger.info('  something 4....');
        AppLogger.info('Finished doing something.');
    }
    else
    {
        AppLogger.info('Bang!');
    } 
}
