var express = require('express');
var router = express.Router();
var restaurant = require('./restaurant_api');

// Retrieve and return all notes from the database.
exports.findAll = function (req, callback) {
  req.db.collection("restaurant").find({}).toArray(function (err, res2) {
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

module.exports = router;
