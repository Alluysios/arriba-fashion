const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewController.getOverview);
router.get('/shop', authController.isLoggedIn, viewController.getShop);
router.get('/product/:slug', authController.isLoggedIn, viewController.getProduct);
router.get('/book', authController.isLoggedIn, viewController.getContactForm)
router.get('/myAccount', authController.isLoggedIn, viewController.getMyAccount)

module.exports = router;