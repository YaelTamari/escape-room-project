// client/src/api/elementApi.js
import { apiClient } from './apiClient';

// יצירת חפץ (פופ-אפ) בחדר
export const createRoomElement = async (roomId, elementData) => {
    // נניח שזה הנתיב שתגדירו בשרת:
    return await apiClient(`/elements/room/${roomId}`, 'POST', elementData);
};

// שליפת החפצים של החדר (כשהשחקן נכנס לחדר וצריך לראות כפתורים בצד)
export const getRoomElements = async (roomId) => {
    return await apiClient(`/elements/room/${roomId}`, 'GET');
};