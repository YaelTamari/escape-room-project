import UserModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'my_super_secret_key_123';

const register = async (req, res) => {
    const { username, password, role } = req.body;

    const ALLOWED_DEVELOPERS = [
        { username: 'יעל', password: '1234' },
        { username: 'נעמי', password: '123456' }
    ];

    if (role === 'developer') {
        const isAuthorized = ALLOWED_DEVELOPERS.some(
            dev => dev.username === username && dev.password === password
        );

        if (!isAuthorized) {
            return res.status(403).json({
                success: false,
                message: "גישה נדחתה: רק מנהלות האתר מורשות להירשם כמפתחות."
            });
        }
    }

    try {
        const existingUser = await UserModel.findByUsername(username);
        if (existingUser) {
            return res.status(409).json({ success: false, message: "שם המשתמש כבר תפוס במערכת" });
        }

        const userRole = role || 'player';
        const userId = await UserModel.create(username, password, userRole);

        const token = jwt.sign(
            { id: userId, role: userRole },
            JWT_SECRET,
            { expiresIn: '5h' }
        );

        res.status(201).json({
            success: true,
            message: "המשתמש נרשם בהצלחה!",
            token, 
            user: { id: userId, username: username, role: userRole, points: 0 } 
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


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
            { expiresIn: '5h' }
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

export default {
    register,
    login
};

