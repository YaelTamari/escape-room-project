// client/src/api/authApi.js
import { apiClient } from './apiClient';

// התחברות
export const loginUser = async (username, password) => {
    return await apiClient('/auth/login', 'POST', { username, password });
};

// הרשמה
export const registerUser = async (username, password, role) => {
    return await apiClient('/auth/register', 'POST', { username, password, role });
};









// import axios from 'axios';
// const BASE_URL = 'http://localhost:5000/api/auth'; 

// // 1. פונקציית התחברות
// export const loginUser = async (username, password) => {
//     // השרת שלך מצפה לקבל באובייקט: username ו-password
//     const response = await axios.post(`${BASE_URL}/login`, { username, password });
//     return response.data; // מחזיר את ה-json עם ה-token וה-user
// };

// // 2. פונקציית הרשמה
// export const registerUser = async (username, password, role) => {
//     // השרת שלך מצפה ל-username, password, ו-role ('player' או 'developer')
//     const response = await axios.post(`${BASE_URL}/register`, { username, password, role });
//     return response.data;
// };