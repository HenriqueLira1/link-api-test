import axios from 'axios';

const pipeDriveApi = axios.create({
    baseURL: 'https://api.pipedrive.com/v1/',
});

export default pipeDriveApi;
