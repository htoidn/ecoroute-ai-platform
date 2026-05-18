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
    return API.get(`/users`);
};

// Get all users map for recommendations
export const getAllUsersMap = async () => {
    const response = await API.get(`/users`);
    const usersMap: { [key: number]: any } = {};
    response.data.forEach((user: any) => {
        usersMap[user.id] = user;
    });
    return usersMap;
};

// External APIs Integration
// Weather API calls
export const getWeather = async (city: string) => {
    return API.get(`/weather/${city}`);
};

// Route API calls
export const getRoute = async (startLat: number, startLon: number, endLat: number, endLon: number) => {
    return API.get(`/routes`, {
        params: {
            startLat,
            startLon,
            endLat,
            endLon
        }
    });
};

// Tourism API calls
export const getTourism = async (latitude: number, longitude: number, radius: number = 5) => {
    return API.get(`/tourism`, {
        params: {
            latitude,
            longitude,
            radius
        }
    });
};

// Carbon Emissions API calls
export const getCarbon = async (transportType: string, distance: number) => {
    return API.get(`/carbon`, {
        params: {
            transportType,
            distance
        }
    });
};

export default API;

