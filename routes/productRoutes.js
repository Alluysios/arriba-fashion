const express = require('express');

const productController = require('./../controllers/productController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.get('/checkout-session/:productId', authController.protect, productController.getCheckoutSession)

//  use review router if it enounter a route like /:reviewId/reviews
router.use('/:productId/reviews', reviewRouter);

router.route('/products-category').get(productController.getProductsByCategory)
router.route('/top5-cheap-products').get(productController.aliasCheapProducts, productController.getAllProducts)

router.route('/')
    .get(productController.getAllProducts)
    .post(
            authController.protect,
            productController.uploadProduct,
            productController.resizeUploadProducts, 
            productController.createProduct
        )

router.route('/:pid')
    .get(productController.getProduct)
    .patch(authController.protect, 
        authController.onlyFor('admin'), 
        productController.uploadProduct,
        productController.resizeUploadProducts, 
        productController.updateProduct)
    .delete(authController.protect, authController.onlyFor('admin'), productController.deleteProduct);

// SIMPLE NESTED ROUTE
// router.route('/:reviewId/reviews')
//         .post(reviewController.createReview);


module.exports = router;