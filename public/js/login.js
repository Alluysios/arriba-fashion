import axios from 'axios';

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email,
                password
            }
        });
        if(res.data.status === 'success') {
            window.setTimeout(() => {
                location.assign('/');
            }, 1000);
        }
    } catch(err) {
        alert(err.response.data.message);
    }
}

export const logout = async() => {
    try {
        const res = await axios({
            method: 'GET',
            url: '/api/v1/users/logout'
        });

        if(res.data.status === "success") {
            location.assign('/');
        }
    } catch(err) {
        
    }
}

export const signUp = async(name, email, password, passwordConfirm) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/signup',
            data: {
                name,
                email,
                password,
                passwordConfirm
            }
        });

        if(res.data.status === 'success') {
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch(err) {
        console.log(err.response.data.message)
    }
}