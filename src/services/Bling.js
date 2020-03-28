import axios from 'axios';

const bling = axios.create({
    baseURL: 'https://bling.com.br/Api/v2/',
    params: {
        ap,
    },
});

export default bling;
