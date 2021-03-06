var AppLogger = require('../lib/logger').ApplicationLogger;
var getRequestUid = require('../lib/logger').GetRequestUid;

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
            AppLogger.info('Returning status: alive');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ status: 'alive' }));        	
        });

    app.route('/1/doSomething')
        .get(function(req, res){
            AppLogger.info('Starting to do something....');
            AppLogger.info('  something 1....');
            AppLogger.info('  something 2....');

            var TestJobQueuer = require('../models/TestJobQueuer.js');
            var jobQueuer = new TestJobQueuer();
            AppLogger.info('Queuing job. Passing logging id: ' + getRequestUid());
            jobQueuer.queueJob(getRequestUid(), 'test', function(err, jobId){
                AppLogger.info('Job Queued, id: ' + jobId);
                if(err){
                    res.status(500).end();
                } else{
                    res.status(200).end();
                }
            });

            setTimeout(doSomethingLater,2000);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ status: 'Started' }));           
        });
};

function doSomethingLater() {
    AppLogger.info('  something 3....');
    AppLogger.info('  something 4....');
    AppLogger.info('Finished doing something.');
}
