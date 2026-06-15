import { apiClient } from './apiClient';

// פונקציה חכמה שמקבלת סוג, עמוד, וכמות
export const getAssets = async (type, page = 1, limit = 10) => {
    // מפעילים את apiClient כפונקציה ישירה, ומעבירים לה את הנתיב (היא כבר תעשה GET אוטומטית)
    const response = await apiClient(`/assets?type=${type}&page=${page}&limit=${limit}`);
    
    // שימי לב: ה-apiClient שלך כבר מחזיר בסוף 'return response.data' נקי!
    // לכן, המשתנה result שחוזר כאן הוא כבר המידע עצמו, ולא צריך לעשות שוב .data
    return response; 
};