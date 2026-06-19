import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api'; 

export const apiClient = async (endpoint, method = 'GET', data = null) => {
    const token = localStorage.getItem('token');

    const config = {
        method: method, // GET, POST, PUT, DELETE
        url: `${BASE_URL}${endpoint}`, 
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
        config.data = data;
    }
    try {
        const response = await axios(config);
        return response.data; 
    } catch (error) {
        console.error(`API Error at ${endpoint}:`, error.response?.data || error.message);
        throw error.response?.data || error;
    }
};