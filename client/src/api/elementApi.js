import { apiClient } from './apiClient';

export const createRoomElement = async (roomId, elementData) => {
    return await apiClient(`/elements/room/${roomId}`, 'POST', elementData);
};

export const getRoomElements = async (roomId) => {
    return await apiClient(`/elements/room/${roomId}`, 'GET');
};