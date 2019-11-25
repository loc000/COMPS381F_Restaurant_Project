var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;


exports.create = function (req, userObj, callback) {
    var myobj = {
        userid: userObj.userid,
        password: userObj.password,
    };
    if (myobj.userid === undefined || myobj.password === undefined) {
        console.log("Error: userid and password are mandatory");
        callback({result: {n: 0}});
    } else {
        req.db.collection("user").insertOne(myobj, function (err, res) {
            if (err) throw err;
            callback(res)
        });
    }
};

// Find a single note with a noteId
exports.find_with_field = function (req, query, callback) {
    req.db.collection("user").find(query).toArray(function (err, res2) {
        if (err) throw err;
        callback(res2);
    });
};

// Update a note identified by the noteId in the request
exports.update = function (req, query, newvalues, callback) {
    req.db.collection("user").updateOne(myquery, newvalues, function (err, res) {
        callback(res);
    });
};

// Delete a note with the specified noteId in the request
exports.delete = function (req, query, callback) {
    req.db.collection("user").deleteOne(myquery, function (err, obj) {
        if (err) throw err;
        callback(obj);
    });

};
module.exports = router;

// router.post('/', function (req, res, next) {
//     exports.create(req, res);
// });
// router.get('/', function (req, res) {
//     exports.findAll(req, function (user_array) {
//         res.json(user_array);
//     });
// });
router.post('/register', function (req, res) {
    // exports.create(req, res);
    var myobj = {
        userid: req.body.userid,
        password: req.body.password,
    };

    exports.create(req, myobj, function (db_res) {
        if (db_res.result.n === 1) {
            res.send(`{status: ok,_id: ${db_res.ops[0]._id}}`);
        } else {
            res.status(400);
            res.send("{status:failed}");
            return;
        }
    });
});
router.post('/login', function (req, res, next) {
    var myobj = {
        userid: req.body.userid,
        password: req.body.password,
    };
    exports.find_with_field(req, myobj, function (user_array) {
        if (user_array.length > 0) {
            console.log(user_array);
            req.session.userid = myobj.userid;
        }
    });
});
router.get('/logout', function (req, res, next) {
    req.session = null;

});