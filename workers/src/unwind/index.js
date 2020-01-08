const unwind = require('./unwind');

const collectionsNames = [
    'speed',
    'soc',
    'current',
    'odo',
    'voltage',
];

function collectionUnwind(collection, start, end) {
    const stream = unwind(collection, start, end);
    const data = [];
    return new Promise(function (resolve, reject) {
        stream.on('data', function (chunk) {
            data.push({ time: chunk.time, value: chunk.value });
        });
        stream.on('end', () => resolve(data)  );
        stream.on("error", error => reject(error));
    })
}

function allCollections(db, start, end) {
    const allCollections = collectionsNames.map((collection) => {
        const dbCollection = db.collection(collection);
        return collectionUnwind(dbCollection, start, end);
    });

    return Promise.all(allCollections);
}

module.exports = allCollections;
