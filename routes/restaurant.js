var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var restaurant = require('./restaurant_api');
var _ = require('underscore');

/* GET home page. */
router.get('/create', function (req, res, next) {
    res.render('create_restaurant', {
        title: 'Create Restaurant',
        action: "/api/restaurant",
        method: "POST",
    });
});
router.get('/update/restaurant_id/:id', function (req, res, next) {
    restaurant.find_with_field(req, {restaurant_id: new ObjectID(req.params.id)}, function (restaurant_array) {
        if (restaurant_array.length > 0) {
            _.extend(res.locals, restaurant_array[0]);
            _.extend(res.locals, restaurant_array[0].address);
            res.render('create_restaurant', {
                title: 'Update Restaurant',
                action: "/api/restaurant",
                method: "PUT",
            });
        } else {
            res.status(404).end();
        }
    });

});

module.exports = router;
