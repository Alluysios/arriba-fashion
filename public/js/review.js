import axios from 'axios';

const reviewForm = document.querySelector('.form--review');
const reviewb = document.querySelector('.review');
const product = document.querySelector('.product');

export const writeReview = async (productId, review, rating) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `/api/v1/products/${productId}/reviews`,
            data: {
                review,
                rating
            }
        });

        if(res.data.status === 'success') {
            reviewForm.classList.add('hide');
            reviewb.classList.remove('enabled');
            product.classList.remove('disabled');
            alert('Thanks for your review');
        }
    } catch(err) {
        alert('You\'re not login!! please. Login to write a review');
    }
}