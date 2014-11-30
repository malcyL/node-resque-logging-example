var config = module.exports = {},
    env = process.env.NODE_ENV || 'development';

console.log(env);

config.logging = {};

config.resque = {};