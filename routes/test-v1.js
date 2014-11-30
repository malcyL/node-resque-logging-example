var AppLogger = require('../lib/logger').ApplicationLogger;

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
};