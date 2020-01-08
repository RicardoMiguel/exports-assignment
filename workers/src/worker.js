const compressing = require('compressing');
const zlib = require('zlib');

const db = require('./db');
const queue = require('./queue');
const fileHosting = require('./fileHosting');
const unwind = require('./unwind');
const dataToTimeSeries = require('./timeSeriesData');
const toCsv = require('./csv');
const job = require('./job');
const logger = require('./logger');

// const start = new Date("2018-11-30").valueOf();
// const end = new Date("2018-12-01").valueOf();

async function task ({ vehicleDatabases, exportsDatabase }, id) {
    logger.info(`Gonna start task for ${id}`);
    const hrStart = process.hrtime();

    try {
        const { value: newJob } = await job.startJob(exportsDatabase, id);

        logger.debug(`Retrieving information from ${newJob.startDate} to ${newJob.endDate}}`, {
            startDate: newJob.startDate.valueOf(),
            endDate: newJob.endDate.valueOf()
        });
        const promises = vehicleDatabases.map(db => unwind(db, newJob.startDate.valueOf(), newJob.endDate.valueOf()));
        const vehiclesDbOut = await Promise.all(promises);
        logger.debug('Got all data from database');

        const vehiclesCsv = vehiclesDbOut
            .map(dataToTimeSeries)
            .map(toCsv);
        logger.debug('Processed all vehicle data and converted to CSV');

        const tar = new compressing.tar.Stream();
        vehiclesCsv.forEach((vehicleCsv, index) => {
            tar.addEntry(Buffer.from(vehicleCsv),
            { suppressSizeWarning: true, relativePath: `${vehicleDatabases[index].databaseName}.csv` }
            );
        });
        logger.debug('Zipped files');

        const archive = tar.pipe(zlib.createGzip());
        const archiveFileName = `export-${newJob._id}.tar.gz`;
        await fileHosting.uploadFile(archiveFileName, archive);
        logger.debug('Uploaded Zip file');

        await job.finishJob(exportsDatabase, newJob._id, archiveFileName);
        const [ seconds, nanoSeconds ] = process.hrtime(hrStart);
        logger.info(`Finished task ${id} in ${seconds}s (${nanoSeconds / 100000}ms)`)
    } catch (err) {
        logger.error(err);
        throw err;
    }

}

async function run () {
    try {
        const dbs = await db.getDbs();
        await queue.listenToQueue(task.bind(null, dbs));
        // await task(dbs, '5dfebecc97849bac3a1f34e0'); // testing purposes
    } catch (err) {
        logger.error(err);
        throw err;
    }
}

module.exports = { run };
