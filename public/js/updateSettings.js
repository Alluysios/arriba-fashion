import axios from 'axios';

export const updateAccount = async(name, email) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: '/api/v1/users/updateMe',
            data: {
                name,
                email
            }
        });

        if(res.data.status === 'success') {
           location.reload();
        }
    } catch(err) {
        alert(err.response.data.message);
    }
}

export const updateMyPassword = async(passwordCurrent, password, passwordConfirm) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: '/api/v1/users/updateMyPassword',
            data: {
                passwordCurrent,
                password,
                passwordConfirm
            }
        })

        if(res.data.status === 'success') {
            location.reload(true);
            alert('Password Changed Successfully');
        }
    } catch(err) {
        alert(err.response.data.message)
    }
}