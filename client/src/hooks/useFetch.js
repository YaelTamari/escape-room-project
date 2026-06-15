import { useState, useEffect } from 'react';

// 1. הגדרת ההוק. הוא מקבל 2 דברים: פונקציה להפעיל, ופרמטר (כמו טוקן או ID)
export const useFetch = (apiFunction, param = null) => {

    // 2. פותחים 3 סטייטים שינהלו לנו את המסך
    const [data, setData] = useState(null);    // ישמור את הנתונים שיחזרו
    const [loading, setLoading] = useState(true); // מסך טעינה
    const [error, setError] = useState('');       // הודעת שגיאה

    // 3. יוז-אפקט שירוץ פעם אחת כשהעמוד עולה
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // מדליק את מסך הטעינה
            try {
                // 4. *** כאן הקסם קורה! ***
                // במקום לכתוב פה ישירות getMyRooms(token), אנחנו מפעילים את הפונקציה הגנרית.
                // בפועל, כשהדשבורד רץ, השורה הזו מתורגמת בדיוק ל: await getMyRooms(token)
                const result = await apiFunction(param); 
                
                if (result && result.success) {
                    setData(result); // השליפה הצליחה! שומרים את הנתונים
                } else {
                    setError('שגיאה בקבלת הנתונים מהשרת.');
                }
            } catch (err) {
                setError('שגיאה בתקשורת עם השרת.'); // אם השרת נפל
            } finally {
                setLoading(false); // מכבה את מסך הטעינה בכל מקרה
            }
        };

        // מוודא שאנחנו לא מנסים לשלוף נתונים אם חסר לנו טוקן/ID
        if (param !== undefined) {
            fetchData();
        }
    }, [apiFunction, param]); 

    // 5. ההוק מסתיים ומחזיר לדשבורד אריזה עם 3 המשתנים המוכנים
    return { data, loading, error };
};