const {MongoClient, ObjectId} = require('mongodb');
const MONGO_URL = process.env.MONGODB_URI;
const startServer = async () => {
    MongoClient.connect(MONGO_URL, function (err, client) {
        // if (err) throw err;

        var db = client.db('animals');
        const mongo = {
            Restaurant: db.collection('Restaurant'),
            Address: db.collection('Address'),
            Grade: db.collection('Grade'),
        };
        exports.mongo = mongo;
    });
    // const db = await MongoClient.connect(MONGO_URL);






};
// startServer();
// console.log(MONGO_URL);
//
exports.schema = buildSchema(`
type Restaurant {
  restaurant_id: ID!
  name: String!
  borough: String
  cuisine: [String!]
  photo: String
  photo_mimetype: String
  address: [Address!]
  grades: [Grade!]
  owner: String!
}
type Address{
  street: String
  building: String
  zipcode: Int
  coord: String
}
type Grade{
  user: String!
  score: Int
}
type Query {
  restaurants: [Restaurant]
}
schema {
  query: Query
}
`);

// exports.rootValue = {
//     hello: () => 'Hello world!',
// };
//
