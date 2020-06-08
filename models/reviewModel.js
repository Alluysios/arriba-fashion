const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: [true, 'review must belong to a product']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'review must belong to a user']
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

reviewSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'name'
    })

    next();
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;