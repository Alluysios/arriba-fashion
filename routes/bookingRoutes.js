const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authController');

// {mergeParams} gives you access to params to other router
const router = express.Router();

router.route('/').post(authController.protect, authController.onlyFor('user'), bookingController.mailBooking);

module.exports = router;