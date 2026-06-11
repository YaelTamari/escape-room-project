import jwt from 'jsonwebtoken';
const JWT_SECRET = 'my_super_secret_key_123';

// 1. מידלוור בסיסי: רק מוודא שהמשתמש מחובר ומחלץ את הנתונים שלו מהטוקן
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ success: false, message: "גישה נדחתה. חסר טוקן אבטחה" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // שותל את ה-id וה-role של המשתמש בתוך ה-req
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: "טוקן לא תקף או פג תוקף" });
    }
};

// 2. פונקציה חכמה (Middleware Factory): בודקת האם תפקיד המשתמש נמצא ברשימת המורשים
const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        // req.user מגיע מהמידלוור הקודם (verifyToken)
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: "גישה אסורה. אין לך הרשאות מתאימות לביצוע פעולה זו" 
            });
        }
        next(); // המשתמש מורשה! ממשיכים לקונטרולר
    };
};

export default { verifyToken, restrictTo };