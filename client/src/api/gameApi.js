import { apiClient } from './apiClient';

// 1. כניסה לחדר (מושך את כל השאלות ורושם את השחקן במסד הנתונים)
export const enterRoom = async (roomId) => {
    return await apiClient(`/game/room/${roomId}/enter`, 'POST');
};

// 2. שליחת תשובה לבדיקה
export const submitPlayerAnswer = async (questionId, player_answer) => {
    return await apiClient(`/game/question/${questionId}/submit`, 'POST', { player_answer });
};

// 3. סיום המשחק
export const finishPlayerRoom = async (roomId) => {
    return await apiClient(`/game/room/${roomId}/finish`, 'POST');
};

// export const requestHint = async (questionId) => {
//     const response = await apiClient.get(`/game/question/${questionId}/hint`);
//     return response.data;
// };

export const requestHint = async (questionId) => {
    // קריאת GET רגילה התואמת ל-apiClient שלך
    return await apiClient(`/game/question/${questionId}/hint`, 'POST');
};