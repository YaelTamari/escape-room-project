
// client/src/api/questionApi.js
import { apiClient } from './apiClient';

// הוספת שאלה לחדר (יופעל מעמוד ה-ManageRoomContent)
export const createQuestion = async (roomId, questionData) => {
    return await apiClient(`/rooms/${roomId}/questions`, 'POST', questionData);
};

// שליפת שאלות של חדר ספציפי (למשל כשהשחקן מתחיל לשחק)
export const getQuestionsByRoom = async (roomId) => {
    return await apiClient(`/rooms/${roomId}/questions`, 'GET');
};

export const updateQuestion = async (questionId, questionData) => {
    return await apiClient(`/rooms/questions/update/${questionId}`, 'PUT', questionData);
};

// מחיקת שאלה
export const deleteQuestion = async (questionId) => {
    return await apiClient(`/rooms/questions/delete/${questionId}`, 'DELETE');
};