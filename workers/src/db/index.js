const { MongoClient } = require('mongodb');

async function getDbs () {
    const uri = process.env.MONGO_URI;
    const connection = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const adminDb = connection.db('admin').admin();
    const allDatabases = await adminDb.listDatabases();

    const vehicleDatabases = allDatabases.databases
        .filter((db) => db.name.startsWith('vehicle'))
        .map((db) => connection.db(db.name));

    const exportsDatabase = connection.db('exports');

    return { connection, vehicleDatabases, exportsDatabase };
}

module.exports = { getDbs };