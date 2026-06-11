// client/src/api/roomApi.js
import { apiClient } from './apiClient';

// שימי לב: מחקנו את ה-token מהפרמטרים!
export const getAllRooms = async () => {
    // כשלא מעבירים 'POST' וכו', ברירת המחדל של apiClient היא 'GET'
    return await apiClient('/rooms/'); 
};

export const getMyRooms = async () => {
    return await apiClient('/rooms/my-rooms');
};

export const createRoom = async (roomData) => {
    return await apiClient('/rooms/create', 'POST', roomData);
};

export const updateRoom = async (roomId, roomData) => {
    return await apiClient(`/rooms/update/${roomId}`, 'PUT', roomData);
};

export const deleteRoom = async (roomId) => {
    return await apiClient(`/rooms/delete/${roomId}`, 'DELETE');
};










// import axios from 'axios';

// const BASE_URL = 'http://localhost:5000/api/rooms'; 

// // 1. שליפת כל החדרים (ללובי השחקנים)
// export const getAllRooms = async (token) => {
//     const response = await axios.get(`${BASE_URL}/`, {
//         headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data; 
// };

// // 2. שליפת החדרים של המפתח שהתחבר (לדאשבורד המפתח)
// export const getMyRooms = async (token) => {
//     const response = await axios.get(`${BASE_URL}/my-rooms`, {
//         headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data; 
// };

// // 3. הוספת חדר חדש למערכת (הותאם לראוט /create בשרת)
// export const createRoom = async (roomData, token) => {
//     const response = await axios.post(`${BASE_URL}/create`, roomData, {
//         headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data;
// };

// // 4. עדכון חדר קיים (הותאם לראוט /update/:id בשרת)
// export const updateRoom = async (roomId, roomData, token) => {
//     const response = await axios.put(`${BASE_URL}/update/${roomId}`, roomData, {
//         headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data;
// };

// // 5. מחיקת חדר (הותאם לראוט /delete/:id בשרת)
// export const deleteRoom = async (roomId, token) => {
//     const response = await axios.delete(`${BASE_URL}/delete/${roomId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data;
// };