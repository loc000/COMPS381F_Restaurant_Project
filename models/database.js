const assert = require("assert");
const client = require("mongodb").MongoClient;
let _db;
module.exports = {
    getDb,
    initDb
};

function initDb(callback) {
    if (_db) {
        console.warn("Trying to init DB again!");
        return callback(null, _db);
    }
    const MONGO_URL = process.env.MONGODB_URI;
    client.connect(MONGO_URL,  { useUnifiedTopology: true },function (err, db) {
        if (err) {
            return callback(err);
        }
        console.log("DB initialized - connected to: " + MONGO_URL.split("@")[1]);
        _db = db.db("heroku_cd0kmj20");
        return callback(null, _db);
    });

}

function getDb() {
    assert.ok(_db, "Db has not been initialized. Please called init first.");
    return _db;
}
