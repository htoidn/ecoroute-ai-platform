import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api'
});

// Destination API calls
export const getAllDestinations = async () => {
    return API.get('/destinations');
};

export const getDestinationById = async (id: number) => {
    return API.get(`/destinations/${id}`);
};

export const searchDestinations = async (keyword: string) => {
    return API.get(`/destinations/search?keyword=${keyword}`);
};

// Recommendations API calls
export const getAllRecommendations = async () => {
    return API.get('/recommendations');
};

export const getRecommendations = async (userId: number) => {
    return API.get(`/recommendations/user/${userId}`);
};

export const recommendDestination = async (input: string) => {
    return API.post('/recommend', input);
};

// User API calls
export const getUserById = async (id: number) => {
    return API.get(`/users/${id}`);
};

export const getAllUsers = async () => {
    return API.get('/users');
};

