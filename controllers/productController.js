const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Product = require('./../models/productModel');
const APIFeatures = require('./../utils/apiFeatures');


const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const multer = require('multer');
const sharp = require('sharp');

// DIRECT
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, `public/img/products`);
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `product-${Date.now()}.${ext}`);
//     }
// })

// BUFF
const storage = multer.memoryStorage();

// Check if file is image
const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image!'), false);
    }
}

const upload = multer({ 
    storage: storage,
    fileFilter: multerFilter
});


exports.resizeUploadProducts = async(req, res, next) => {
    if(req.files.image) {
        req.body.image = `product-${Date.now()}.jpeg`;
    
        await sharp(req.files.image[0].buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({quality: 95})
            .toFile(`public/img/products/${req.body.image}`);
    }

    if (req.files.images) {
        req.body.images = [];

        await Promise.all(req.files.images.map(async(file, i) => {
            const filename = `product-${Date.now()}-showlist-${i + 1}.jpeg`;
    
            await sharp(file.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({quality: 95})
                .toFile(`public/img/products/${filename}`)
    
            req.body.images.push(filename)
        }))
    }

    next();
};

exports.uploadProduct = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 6 }
]);

exports.getAllProducts = async(req, res) => {
    let filter = {}
    const features = new APIFeatures(Product.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    
    const products = await features.query.populate('review');

    res.status(200).json({
        status: 'success',
        results: products.length,
        data: {
            products
        }
    })
}

exports.getProduct = catchAsync(async(req, res, next) => {
    const product = await Product.findById(req.params.pid);

    if (!product) {
        return next(new AppError('No product found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    })
})

exports.createProduct = catchAsync(async(req, res, next) => {
    const product = await Product.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            product
        }
    })
})

exports.updateProduct = catchAsync(async(req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.pid, req.body, {
        new: true,
        runValidators: true
    });

    if (!product) {
        return next(new AppError('No product found with that ID', 404));
    }

    res.status(200).json({
        status: 'updated',
        data: {
            product
        }
    })
})

exports.deleteProduct = catchAsync(async(req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.pid);

    if (!product) {
        return next(new AppError('No product found with that ID', 404));
    }

    res.status(204).json({})
})

// AGGREGRATIONS
exports.getProductsByCategory = async(req, res) => {
    const productsByCategories = await Product.aggregate([
        {
            $group: {
                _id: {$toUpper: '$category'},
                numProducts: { $sum: 1 },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                avgPrice: { $avg: '$price'}
            }
        },
        {
            $sort: { avgPrice: 1 }
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            productsByCategories
        }
    });
};

exports.aliasCheapProducts = (req, res, next) => {
    req.query.field = 'name price category description';
    req.query.sort = 'price,name,category';
    req.query.limit = '5';
    next();
}

// STRIPE PAYMENT
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // Get the current product ID
    const product = await Product.findById(req.params.productId);

    // Create Checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url:`${req.protocol}://${req.get('host')}/`,
        cancel_url:`${req.protocol}://${req.get('host')}/product/${product.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.productId,
        line_items: [
            {
                name: product.name,
                description: product.description,
                // images used when website is deployed
                images: [`https://images.unsplash.com/photo-1542295669297-4d352b042bca?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80`],
                amount: product.price * 100,
                currency: 'cad',
                quantity: 1
            }
        ]
    })

    // Create session as response
    res.status(200).json({
        status: 'sucess',
        session
    })
})