import axios from 'axios';

export const sendEmail = async(bookDate, message) => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/booking',
            data: {
                bookDate,
                message
            }
            
        })

        if(res.data.status === 'success') {
            // console.log(res);
        }
    } catch(err) {
        console.log(err.response.data.message);
    }
   

}