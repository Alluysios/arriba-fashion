const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        minlength: 3,
        maxlength: 18,
        required: [true, 'Product must have a name']
    },
    description: {
        type: String,
        required: [true, 'Product must have a description']
    },
    category: {
        type: String,
        lowercase: true,
        required: [true, 'Product must belong to a category']
    },
    price: {
        type: Number,
        required: [true, 'Product must have a price']
    },
    sale: { 
        type: Boolean,
        default: false
    },
    featured: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        select: false
    },
    size: [String],
    image: String,
    images: [String],
    slug: String
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

productSchema.index({ name: 1 })

// Virtual populate
productSchema.virtual('review', {
    // name of the model
    ref:'Review',
    // field name of the other model (where the id is in this case it's blog)
    foreignField: 'product',
    localField: '_id'
})

productSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {
        lower: true
    });

    next();
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;