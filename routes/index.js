var express = require('express');
var router = express.Router();
var restaurant = require('./restaurant_api');
var ObjectId = require('mongodb').ObjectID;

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

/* GET home page. */
router.get('/', function(req, res, next) {
  exports.findAll(req, function (restaurant_array) {
    //res.json(restaurant_array);
    res.render('index', { title: 'Restaurants Collection',restaurants: restaurant_array });
  });
});

router.get('/restaurant/name/:name', function (req, res, next) {
    exports.find_with_field(req, {name: req.params.name}, function (restaurant_array) {
        //res.end(JSON.stringify(restaurant_array));
        res.render('restaurant', { title: 'Restaurants Collection',restaurants: restaurant_array });
    });
});
router.get('/restaurant/restaurant_id/:id', function (req, res, next) {
    exports.find_with_field(req, {restaurant_id:  new ObjectId(req.params.id)}, function (restaurant_array) {
        //res.end(JSON.stringify(restaurant_array));
        // console.log(restaurant_array);
        let rated = false;
        restaurant_array[0].grades.forEach(function (value, index, array) {
           if (value.user=req.session.userid){
               rated=true;
           }
        });
        res.render('restaurant', { title: 'Restaurants Collection',restaurants: restaurant_array });
    });
});

module.exports = router;
