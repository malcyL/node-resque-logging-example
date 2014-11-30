var config = require('./config.global');

/*
 Development-specific settings
 */

config.env = 'development';

config.logging.access_log = "logs/test.access.log";
config.logging.app_log = "logs/test-api.log";
config.logging.bg_log = "logs/test-bg.log";
config.logging.log_level = "debug";

module.exports = config;