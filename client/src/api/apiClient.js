// client/src/api/apiClient.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api'; 

export const apiClient = async (endpoint, method = 'GET', data = null) => {
    // 1. שולפים את הטוקן פעם אחת כאן!
    const token = localStorage.getItem('token');

    // 2. מכינים את הגדרות הבקשה (קונפיגורציה)
    const config = {
        method: method, // האם זה GET, POST, PUT, DELETE?
        url: `${BASE_URL}${endpoint}`, // מחברים את כתובת הבסיס עם הנתיב הספציפי
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // 3. החלק הקסום: אם יש למשתמש טוקן, אנחנו מזריקים אותו אוטומטית לכל בקשה!
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    // 4. אם שלחו לנו מידע (למשל פרטי התחברות או נתוני חדר חדש), נצרף אותו לבקשה
    if (data) {
        config.data = data;
    }

    // 5. מבצעים את הבקשה דרך אקסיוס
    try {
        const response = await axios(config);
        return response.data; // מחזירים רק את הדאטה הנקי לריאקט
    } catch (error) {
        // טיפול אחיד בשגיאות - מקל מאוד על זיהוי באגים
        console.error(`API Error at ${endpoint}:`, error.response?.data || error.message);
        throw error.response?.data || error;
    }
};