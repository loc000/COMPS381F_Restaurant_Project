const fs = require('fs');

var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var formidable = require('formidable');


exports.create = function (req, restaurantObj, callback) {
    var myobj = {
        restaurant_id: new ObjectID(),
        name: restaurantObj.name,
        borough: restaurantObj.borough || null,
        cuisine: restaurantObj.cuisine || null,
        photo: restaurantObj.photo || null,
        photo_mimetype: restaurantObj.photo_mimetype || null,
        address: {
            street: restaurantObj.street || null,
            building: restaurantObj.building || null,
            zipcode: restaurantObj.zipcode || null,
            coord: restaurantObj.coord || null,
        },
        grades: [],
        owner: restaurantObj.owner,
    };
    if (myobj.owner === undefined || myobj.name === undefined||myobj.owner.length<= 0||myobj.name.length<= 0) {
        console.log(myobj);
        console.log("Error: name and owner are mandatory; other attributes are optional");
        callback({result: {n: 0}});
    } else {
        req.db.collection("restaurant").insertOne(myobj, function (err, res) {
            if (err) throw err;
            callback(res)
        });
    }
};


// Retrieve and return all notes from the database.
exports.findAll = function (req, callback) {
    req.db.collection("restaurant").find({}).toArray(function (err, res2) {
        if (err) throw err;
        callback(res2);
    });
};

// Find a single note with a noteId
exports.find_with_field = function (req, query, callback) {
    req.db.collection("restaurant").find(query).toArray(function (err, res2) {
        if (err) throw err;
        callback(res2);
    });
};

// Update a note identified by the noteId in the request
exports.update = function (req, query, newvalues, callback) {
    req.db.collection("restaurant").updateOne(myquery, newvalues, function (err, res) {
        callback(res);
    });
};

// Delete a note with the specified noteId in the request
exports.delete = function (req, query, callback) {
    req.db.collection("restaurant").deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        callback(obj);
    });

};
module.exports = router;

// router.post('/', function (req, res, next) {
//     exports.create(req, res);
// });
router.get('/', function (req, res) {
    exports.findAll(req, function (restaurant_array) {
        res.json(restaurant_array);
    });
});
router.post('/', function (req, res) {
    // exports.create(req, res);
    if (req.headers['content-type'].startsWith("multipart/form-data;")) {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var myobj = {
                name: fields['name'],
                borough: fields['borough'],
                cuisine: fields['cuisine'],
                grades: [],
                owner: req.session.userid,
                street: fields['street'],
                building: fields['building'],
                zipcode: fields['zipcode'],
                coord: fields['coord'],
            };

            var filename = files.photo.path;
            var mimetype = files.photo.type;
            if ( files.photo.size>0) {
                fs.readFile(filename, function (err, data) {
                    if (err) throw err;
                    myobj.photo = new Buffer(data).toString('base64');
                    myobj.photo_mimetype = mimetype;
                    exports.create(req, myobj, function (db_res) {
                        if (db_res.result.n === 1) {
                            exports.find_with_field(req, {_id: db_res.ops[0]._id}, function (find_result) {
                                res.json({
                                    status: "ok",
                                    _id: db_res.ops[0]._id,
                                    restaurant_id: find_result[0].restaurant_id,
                                });
                            });
                        } else {
                            res.status(400);
                            res.send(`{"status":"Restaurant name is mandatory; other attributes are optional"}`);
                        }
                    });
                })
            }else{
                exports.create(req, myobj, function (db_res) {
                    if (db_res.result.n === 1) {
                        exports.find_with_field(req, {_id: db_res.ops[0]._id}, function (find_result) {
                            res.json({
                                status: "ok",
                                _id: db_res.ops[0]._id,
                                restaurant_id: find_result[0].restaurant_id,
                            });
                        });
                    } else {
                        res.status(400);
                        res.send(`{"status":"Restaurant name is mandatory; other attributes are optional"}`);
                    }
                });
            }
        });
    } else {
        var myobj = {
            name: req.body.name,
            borough: req.body.borough,
            cuisine: req.body.cuisine,
            photo: req.body.photo,
            photo_mimetype: req.body.photo_mimetype,
            grades: [],
            owner: req.body.owner,
        };
        if (req.body.address) {
            myobj.street = req.body.address.street;
            myobj.building = req.body.address.building;
            myobj.zipcode = req.body.address.zipcode;
            myobj.coord = req.body.address.coord
        }
        // if (req.body.grades) {
        //     req.body.grades.forEach(element => {
        //         myobj.grades.push({
        //             "user": element.user,
        //             "score": element.score,
        //         })
        //     })
        // }
        exports.create(req, myobj, function (db_res) {
            if (db_res.result.n === 1) {
                res.send(`{status: ok,_id: ${db_res.ops[0]._id}}`);
            } else {
                res.status(400);
                res.send("{status:failed}");
                return;
            }
        });
    }
});

router.get('//:name', function (req, res, next) {
    exports.find_with_field(req, {name: req.params.name}, function (restaurant_array) {
        res.end(JSON.stringify(restaurant_array));
    });
});
