import axios from 'axios';

const API_URL = 'http://localhost:5000/api/rooms'; 

export const getRoomElements = async (roomId) => {
    const response = await axios.get(`${API_URL}/${roomId}/elements`);
    return response.data; 
};

export const createRoomElement = async (roomId, elementData) => {
    const response = await axios.post(`${API_URL}/${roomId}/elements`, elementData);
    return response.data;
};

export const deleteRoomElement = async (id) => {
    const response = await axios.delete(`${API_URL}/elements/${id}`);
    return response.data;
};