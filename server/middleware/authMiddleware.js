import jwt from 'jsonwebtoken';
const JWT_SECRET = 'my_super_secret_key_123';

const verifyDeveloper = (req, res, next) => {
    // שלפת הטוקן מתוך ה-Header של הבקשה
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // הטוקן מגיע לרוב בפורמט: "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ success: false, message: "גישה נדחתה. חסר טוקן אבטחה" });
    }

    try {
        // אימות הטוקן
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // בדיקה האם המשתמש הוא מפתח
        if (decoded.role !== 'developer') {
            return res.status(403).json({ success: false, message: "גישה אסורה. רק מפתחים מורשים לבצע פעולה זו" });
        }

        // אם הכל תקין, שומרים את נתוני המשתמש על ה-req כדי שהקונטרולר יוכל להשתמש בהם
        req.user = decoded;
        
        next(); // ממשיכים לפונקציה הבאה בקונטרולר!
    } catch (err) {
        res.status(403).json({ success: false, message: "טוקן לא תקף או פג תוקף" });
    }
};

export default { verifyDeveloper };