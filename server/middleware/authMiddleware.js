import jwt from 'jsonwebtoken';
const JWT_SECRET = 'my_super_secret_key_123';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ success: false, message: "גישה נדחתה. חסר טוקן אבטחה" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: "טוקן לא תקף או פג תוקף" });
    }
};

const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: "גישה אסורה. אין לך הרשאות מתאימות לביצוע פעולה זו" 
            });
        }
        next(); 
    };
};

export default { verifyToken, restrictTo };