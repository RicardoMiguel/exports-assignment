require('dotenv').config({ path: '../.env' });
const cluster = require('cluster');

const worker = require('./src/worker');
const logger = require('./src/logger');

if (cluster.isMaster) {
    masterProcess();
} else {
    childProcess();
}

logger.info('Process started');

function masterProcess() {
    let clusterCount = 0;
    const numCPUs = require('os').cpus().length;
    for (let i = 0; i < numCPUs; i++) {
        logger.info(`Forking process number ${i}...`);
        cluster.fork();
        ++clusterCount;
    }

    cluster.on('exit', function(worker, code, signal) {
        logger.warn(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
        if(clusterCount === 0) {
            process.exit(1);
        }
    });
}

async function childProcess() {
    try {
        await worker.run();
    } catch (err) {
        logger.fatal('Got unexpected error. Gonna kill this worker...');
        process.exit(1);
    }
}