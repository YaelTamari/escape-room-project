import UserModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'my_super_secret_key_123';

// 1. פונקציית הרשמה
const register = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const existingUser = await UserModel.findByUsername(username);
        if (existingUser) {
            return res.status(409).json({ success: false, message: "שם המשתמש כבר תפוס במערכת" });
        }

        const userRole = role || 'player';
        // השרת יוצר את המשתמש במסד הנתונים
        const userId = await UserModel.create(username, password, userRole);

        // ==== השינוי מתחיל כאן ====
        
        // 1. יוצרים טוקן (JWT) חדש בדיוק כמו בלוגין!
        const token = jwt.sign(
            { id: userId, role: userRole },
            JWT_SECRET,
            { expiresIn: '3h' }
        );

        // 2. מחזירים ללקוח את מה שהוא מצפה: הצלחה, טוקן, ופרטי היוזר
        res.status(201).json({ 
            success: true, 
            message: "המשתמש נרשם בהצלחה!", 
            token, // הנה הטוקן
            user: { id: userId, username: username, role: userRole, points: 0 } // הנה היוזר (הנחנו שמתחילים מ-0 נקודות)
        });
        
        // ==== השינוי מסתיים כאן ====

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
// 2. פונקציית התחברות
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findByUsername(username);
        
        if (!user || user.password !== password) {
            return res.status(401).json({ success: false, message: 'שם משתמש או סיסמה שגויים' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '3h' }
        );

        res.json({ 
            success: true, 
            message: "התחברת בהצלחה!", 
            token,
            user: { id: user.id, username: user.username, role: user.role, points: user.points }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// מייצאים את הפונקציות כאובייקט אחד פשוט בסוף הקובץ!
export default {
    register,
    login
};