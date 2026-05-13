import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api'
});

export const recommendDestination = async (input: string) => {
    return API.post('/recommend', input);
};
