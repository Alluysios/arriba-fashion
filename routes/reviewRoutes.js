const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

// {mergeParams} gives you access to params to other router
const router = express.Router({ mergeParams: true });

router.route('/')
    .get(authController.protect, reviewController.getAllReviews)
    .post(authController.protect, authController.onlyFor('user'), reviewController.setProductUserId, reviewController.createReview);

router.route('/:rid')
    .get(reviewController.getReview)

module.exports = router;