var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;


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
    if (myobj.owner === undefined || myobj.name === undefined) {
        console.log("Error: name and owner are mandatory; other attributes are optional");
        callback({result: {n: 0}});
    }else {
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
exports.update = function (req, res) {

};

// Delete a note with the specified noteId in the request
exports.delete = function (req, res) {

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
            res.status ( 400);
            res.send("{status:failed}");
            return;
        }
    });
});
router.get('/name/:name', function (req, res, next) {
    exports.find_with_field(req, {name:req.params.name},function (restaurant_array) {
        res.end(JSON.stringify(restaurant_array));
    });
});
router.get('/borough/:borough', function (req, res, next) {
    exports.find_with_field(req, {borough:req.params.borough},function (restaurant_array) {
        res.end(JSON.stringify(restaurant_array));
    });
});
router.get('/cuisine/:cuisine', function (req, res, next) {
    exports.find_with_field(req, {cuisine:req.params.cuisine},function (restaurant_array) {
        res.end(JSON.stringify(restaurant_array));
    });
});
