var bunyan = require('bunyan');
var logger = bunyan.createLogger(
    {
        name: 'kusoma',
        stream: process.stdout
    }
    );

module.exports = logger;