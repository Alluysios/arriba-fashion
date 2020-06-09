import '@babel/polyfill';
import { login, logout, signUp } from './login';
import { writeReview } from './review';
import { purchaseProduct } from './stripe';
import { sendEmail } from './mail';
import { updateAccount, updateMyPassword } from './updateSettings'

// Authentication
const loginBtn = document.getElementById('login');
const signUpBtn = document.getElementById('signUp');
const logoutBtn = document.getElementById('logout');
const loginForm = document.querySelector('.form--login');
const signUpForm = document.querySelector('.form--signUp');
const contactForm = document.querySelector('.form--email');
const accountForm = document.querySelector('.form--account');
const changePassForm = document.querySelector('.form--changePassword');

const productImgs = document.querySelector('.product__imgs');
const productHighlight = document.querySelector('.product__highlight');

const buyBtn = document.getElementById('buy-product');
// DROPDOWN NAVIGATION
const dropdownBtn = document.querySelector('.menu-icon-dropdown');

//REVIEW
const writeReviewBtn = document.getElementById('writeReview');
const reviewForm = document.querySelector('.form--review');
const review = document.querySelector('.review');
const product = document.querySelector('.product');

if(reviewForm) {
    reviewForm.addEventListener('submit', e => {
        e.preventDefault();

        const productId = document.getElementById('pid').value;
        const review = document.getElementById('review').value;
        const rating = document.getElementById('rating').value;
        writeReview(productId, review, rating);
    })

    writeReviewBtn.addEventListener('click', e => {
        e.preventDefault();

        reviewForm.classList.toggle('hide');
        review.classList.toggle('enabled');
        product.classList.toggle('disabled');

    })

    document.addEventListener('keydown', e => {
        if(e.keyCode === 27) {
            reviewForm.classList.add('hide');
            review.classList.remove('enabled');
            product.classList.remove('disabled');
        }
    })
    // document.addEventListener('click', e => {
    //     e.preventDefault();
    //     if(e.target.classList.contains('review')) {
    //         reviewForm.classList.add('hide');
    //         review.classList.remove('enabled');
    //         product.classList.remove('disabled');
    //     }
    // })
}

if(contactForm) {
    
    contactForm.addEventListener('submit', e => {
        e.preventDefault();

        const bookDate = document.getElementById('bookDate').value;
        const message = document.getElementById('message').value;

        sendEmail(bookDate, message);
    })
}

if(productImgs) {
    productImgs.addEventListener('click', e => {
        e.preventDefault();
    
        const t = e.target;
        // Get src of the clicked img
        const clickedImg  = t.src;
        // change the src of the highlight img to the src of clicked img
        productHighlight.src = clickedImg;
    })
}

// LOGIN BUTTON
if(loginBtn) {
    loginBtn.addEventListener('click', (evt)=> {
        evt.preventDefault();
    
        if(!signUpForm.classList.contains('hide')) signUpForm.classList.toggle('hide');
        loginForm.classList.toggle('hide');
    })
}

// SIGN UP BTN
if(signUpBtn) {
    signUpBtn.addEventListener('click', (evt)=> {
        evt.preventDefault();
    
        if(!loginForm.classList.contains('hide')) loginForm.classList.toggle('hide');
        signUpForm.classList.toggle('hide');
    })
}

if(logoutBtn) logoutBtn.addEventListener('click', logout);

// LOGIN FORM
if(loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        login(email, password);
    });
}

// SIGN UP FORM
if(signUpForm) {
    signUpForm.addEventListener('submit', e => {
        e.preventDefault();

        const name = document.getElementById('userName').value;
        const email = document.getElementById('userEmail').value;
        const password = document.getElementById('userPassword').value;
        const passwordConfirm = document.getElementById('userPasswordConfirm').value;

        signUp(name, email, password, passwordConfirm);
    })
}

// PURCHASE PRODUCT
if(buyBtn) {
    buyBtn.addEventListener('click', e => {
        e.target.textContent = 'Processing...';
        const { productId } = e.target.dataset;
        purchaseProduct(productId);
    })
}

// ACCOUNT UPDATE
if(accountForm) {
    accountForm.addEventListener('submit', e => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        updateAccount(name, email);
    })
}

if(changePassForm) {
    changePassForm.addEventListener('submit', e => {
        e.preventDefault();

        const currentPass = document.getElementById('currentPass').value;
        const newPass = document.getElementById('newPass').value;
        const confirmPass = document.getElementById('confirmPass').value;

        updateMyPassword(currentPass, newPass, confirmPass);
    })
}

// DROPDOWN NAVIGATION
dropdownBtn.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector('.nav__menu').classList.toggle('hide-dropdown');
    document.querySelector('.nav__user').classList.toggle('hide-dropdown');
})