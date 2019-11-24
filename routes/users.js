var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

/* GET users listing. */
router.get('/', function (req, res, next) {
    var myobj = {
        restaurant_id: new ObjectID(),
        name: "name",
        borough: "String",
        cuisine: "[String!]",
        photo: "String",
        photo_mimetype: "String",
        address: ["Address"],
        grades: [""],
        owner: "String",
    };
    req.db.collection("restaurant").insertOne(myobj, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
    });
    res.send('respond with a resource');
});


module.exports = router;
