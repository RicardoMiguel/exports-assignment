const cluster = require('cluster');
const bunyan = require('bunyan');

module.exports = bunyan.createLogger({
    name: 'workers',
    level: process.env.LOG_LEVEL || 'info',
    isMaster: cluster.isMaster,
    processPid: process.pid
});