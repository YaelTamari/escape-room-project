import { apiClient } from './apiClient';

export const createQuestion = async (roomId, questionData) => {
    return await apiClient(`/rooms/${roomId}/questions`, 'POST', questionData);
};

export const getQuestionsByRoom = async (roomId) => {
    return await apiClient(`/rooms/${roomId}/questions`, 'GET');
};

export const updateQuestion = async (questionId, questionData) => {
    return await apiClient(`/rooms/questions/update/${questionId}`, 'PUT', questionData);
};

export const deleteQuestion = async (questionId) => {
    return await apiClient(`/rooms/questions/delete/${questionId}`, 'DELETE');
};