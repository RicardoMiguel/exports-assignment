'use strict';

const jobService = require('./src');

module.exports.getExport = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const jobId = event.pathParameters.jobId;

    try {
        const job = await jobService.getExport(jobId);

        return {
            statusCode: 200,
            body: JSON.stringify(
                job,
                null,
                2
            ),
        };
    } catch (err) {
        if (err.message === 'NotFound') {
            return { statusCode: 404 };
        }

        return { statusCode: 500 };
    }

};

module.exports.createExport = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const { startDate, endDate } = JSON.parse(event.body);
    const aJobId = await jobService.createExport({
        startDate: new Date(startDate),
        endDate: new Date(endDate)
    });

    return {
        statusCode: 202,
        headers: {
            Location: `http://localhost:3000/export/${aJobId}`
        }
    };
};