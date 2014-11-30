var express = require('express'),
    path = require('path'),
    AccessLogger = require('./lib/logger').AccessLogger,
    AppLogger = require('./lib/logger').ApplicationLogger,
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    http = require('http'),
    https = require('https'),
    expressWinston = require('express-winston');

var app = express();

http.globalAgent.maxSockets = 512; // default is 5
https.globalAgent.maxSockets = 512; // default is 5

app.use(expressWinston.logger({ winstonInstance:AccessLogger }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
require('./routes/index.js')(app);
require('./routes/test-v1.js')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res) {
        AppLogger.error(err.stack);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
    AppLogger.error(err.stack);
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;