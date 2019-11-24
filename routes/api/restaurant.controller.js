var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;


router.get('/', function (req, res, next) {
    findAll(req,res);
});
router.get('/name/:name', function (req, res, next) {
    find_with_field(req,res,name,req.name);
    next();
});
router.get('/borough/:borough', function (req, res, next) {
    find_with_field(req,res,borough,req.borough);
    next();
});
router.get('/cuisine/:cuisine', function (req, res, next) {
    find_with_field(req,res,cuisine,req.cuisine);
    next();
});
router.post('/', function (req, res, next) {
    create(req,res);
    next();
});

exports.create = (req, res) => {
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
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
    req.db.collection("restaurant").find({}).toArray( function (err, res2) {
        if (err) throw err;
        res.send(JSON.stringify(res2));
    });
};

// Find a single note with a noteId
exports.findOne = (req, res) => {

};
// Find a single note with a noteId
exports.find_with_field = (req, res,field) => {

};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {

};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {

};
module.exports = router;
