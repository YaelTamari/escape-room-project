import { apiClient } from './apiClient';

export const enterRoom = async (roomId) => {
    return await apiClient(`/game/room/${roomId}/enter`, 'POST');
};

export const submitPlayerAnswer = async (questionId, player_answer) => {
    return await apiClient(`/game/question/${questionId}/submit`, 'POST', { player_answer });
};

export const finishPlayerRoom = async (roomId) => {
    return await apiClient(`/game/room/${roomId}/finish`, 'POST');
};

export const requestHint = async (questionId) => {
    return await apiClient(`/game/question/${questionId}/hint`, 'POST');
};