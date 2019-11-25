const assert = require('assert');
const client = require('mongodb').MongoClient;

// eslint-disable-next-line no-underscore-dangle
let _db;
function initDb(callback) {
  if (_db) {
    console.warn('Trying to init DB again!');
    return callback(null, _db);
  }
  const MONGO_URL = process.env.MONGODB_URI;
  client.connect(MONGO_URL, { useUnifiedTopology: true }, (err, db) => {
    if (err) {
      return callback(err);
    }
    console.log(`DB initialized - connected to: ${MONGO_URL.split('@')[1]}`);
    _db = db.db('heroku_cd0kmj20');
    return callback(null, _db);
  });
  return false;
}

function getDb() {
  assert.ok(_db, 'Db has not been initialized. Please called init first.');
  return _db;
}
module.exports = {
  initDb,
  getDb,
};
