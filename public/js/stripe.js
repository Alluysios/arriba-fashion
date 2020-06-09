import axios from 'axios';

const buyBtn = document.getElementById('buy-product');

const stripe = Stripe('pk_test_51GqOZ0Gxi8h3WIFqOIoNNPPgXOmLCD941IYNfbBV01pqc5OX9Lvrb2bYf2Z0XHJWECJO6bWjzqZrPMDhyeeUnkvE00CJIzzE7X');

export const purchaseProduct = async productId => {
    try {

        // Get checkout session from endpoint from API
        const session = await axios(
            `/api/v1/products/checkout-session/${productId}`
        );
    
        // Create checkout form + charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })
    } catch(err) {
        buyBtn.textContent = 'BUY!'
        alert(err.response.data.message);
    }

}