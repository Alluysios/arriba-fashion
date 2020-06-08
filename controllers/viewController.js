const Product = require('./../models/productModel'); 
const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');


exports.getOverview = catchAsync(async (req, res, next) => {
    let filter = {};
    const features = new APIFeatures(Product.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const products = await features.query;

    res.status(200).render('overview', {
        title: 'Arriba House of Fashion',
        products
    })
})

exports.getShop = catchAsync(async (req, res, next) => {
    let title = '';
    let filter = {};
    const features = new APIFeatures(Product.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const products = await features.query;

    if(req.query) title = req.query.category;

    res.status(200).render('shop', {
        title: title,
        products
    })
})

exports.getProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findOne({ slug: req.params.slug }).populate('review');

    res.status(200).render('product', {
        title: product.name,
        product
    })
})

exports.getContactForm = catchAsync(async (req, res, next) => {
    
    res.status(200).render('emailForm', {
        title: 'Book Now!!'
    });
})

exports.getMyAccount = catchAsync(async (req, res, next) => {
    
    res.status(200).render('account', {
        title: 'My Account'
    });
})