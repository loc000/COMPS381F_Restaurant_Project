const fs = require('fs');

var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var formidable = require('formidable');
var _ = require('underscore');

module.exports = router;
module.exports.create = function (req, restaurantObj, callback) {
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
    if (myobj.owner === undefined || myobj.name === undefined || myobj.owner.length <= 0 || myobj.name.length <= 0) {
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
module.exports.findAll = function (req, callback) {
    req.db.collection("restaurant").find({}).toArray(function (err, res2) {
        if (err) throw err;
        callback(res2);
    });
};
// Retrieve and return all notes from the database.
module.exports.search = function (req, keyword, callback) {
    // req.db.collection("restaurant").getIndexes().toArray(function (err,res2) {
    //     req.db.collection("restaurant").dropIndex("post_text_text")
    // });
    req.db.collection("restaurant").createIndex({
        "$**": "text",
    }, {name: "index"});
    req.db.collection("restaurant").find({
            $text: {$search:keyword},
    }).toArray(function (err, res2) {
        if (err) throw err;
        callback(res2);
    });
};

// Find a single note with a noteId
module.exports.find_with_field = function (req, query, callback) {
    req.db.collection("restaurant").find(query).toArray(function (err, res2) {
        if (err) throw err;
        callback(res2);
    });
};

// Update a note identified by the noteId in the request
module.exports.update = function (req, query, newvalues, callback) {
    req.db.collection("restaurant").updateOne(query, newvalues, function (err, res) {
        if (err) throw err;
        callback(res);
    });
};

// Delete a note with the specified noteId in the request
module.exports.deleteOne = function (req, query, callback) {
    console.log(req);
    req.db.collection("restaurant").deleteOne(query, function (err, obj) {
        if (err) throw err;
        callback(obj);
    });

};

// router.post('/', function (req, res, next) {
//     exports.create(req, res);
// });


router.get('/', function (req, res) {
    module.exports.findAll(req, function (restaurant_array) {
        res.json(restaurant_array);
    });
});
router.delete('/restaurant_id/:restaurant_id', function (req, res) {
    console.log(req.params);
    module.exports.deleteOne(req, {restaurant_id: ObjectID(req.params.restaurant_id)}, function (restaurant_array) {
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
            if (files.photo.size > 0) {
                fs.readFile(filename, function (err, data) {
                    if (err) throw err;
                    myobj.photo = new Buffer(data).toString('base64');
                    myobj.photo_mimetype = mimetype;
                    module.exports.create(req, myobj, function (db_res) {
                        if (db_res.result.n === 1) {
                            module.exports.find_with_field(req, {_id: db_res.ops[0]._id}, function (find_result) {
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
            } else {
                module.exports.create(req, myobj, function (db_res) {
                    if (db_res.result.n === 1) {
                        module.exports.find_with_field(req, {_id: db_res.ops[0]._id}, function (find_result) {
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
        module.exports.create(req, myobj, function (db_res) {
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

router.put('/', function (req, res) {
    // exports.create(req, res);
    if (req.headers['content-type'].startsWith("multipart/form-data;")) {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var myobj = {
                name: fields['name'],
                borough: fields['borough'],
                cuisine: fields['cuisine'],
                owner: req.session.userid,
                address: {
                    street: fields['street'],
                    building: fields['building'],
                    zipcode: fields['zipcode'],
                    coord: fields['coord'],
                },
            };


            var filename = files.photo.path;
            var mimetype = files.photo.type;
            if (files.photo.size > 0) {
                fs.readFile(filename, function (err, data) {
                    console.log("Update photo");
                    if (err) throw err;
                    myobj.photo = new Buffer(data).toString('base64');
                    myobj.photo_mimetype = mimetype;
                    module.exports.update(req, {restaurant_id: ObjectID(fields['restaurant_id'])}, {$set: myobj}, function (db_res) {
                        if (db_res.result.ok === 1) {
                            res.json({
                                status: "ok",
                                restaurant_id: fields['restaurant_id'],
                            });
                        } else {
                            res.status(400);
                            res.send(`{"status":"Restaurant name is mandatory; other attributes are optional"}`);
                        }
                    });
                })
            } else {
                console.log("Not Update photo");
                module.exports.update(req, {restaurant_id: ObjectID(fields['restaurant_id'])}, {$set: myobj}, function (db_res) {

                    if (db_res.result.ok === 1) {
                        res.json({
                            status: "ok",
                            restaurant_id: fields['restaurant_id'],
                        });

                    } else {
                        res.status(400);
                        res.send(`{"status":"Restaurant name is mandatory; other attributes are optional"}`);
                    }
                });
            }
        });
    } else {
        throw new Error("Not implemented");
    }
});

router.get('//:name', function (req, res, next) {
    module.exports.find_with_field(req, {name: req.params.name}, function (restaurant_array) {
        res.end(JSON.stringify(restaurant_array));
    });
});
router.get('/search/:name', function (req, res, next) {
    console.log(req.params.name);
    module.exports.search(req, req.params.name, function (restaurant_array) {
        res.end(JSON.stringify(restaurant_array));
    });
});

router.post('/rate/restaurant_id/:restaurant_id', function (req, res) {

    module.exports.update(req, {restaurant_id: ObjectID(req.params.restaurant_id)}, {
        $push: {
            grades: {
                user: req.session.userid,
                score: req.body.score
            }
        }
    }, function (restaurant_array) {
        res.end(JSON.stringify(restaurant_array));
    });
});