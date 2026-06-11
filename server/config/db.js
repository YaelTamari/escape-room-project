import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// טעינת משתני הסביבה מקובץ .env
dotenv.config();

// יצירת Pool (בריכת חיבורים) - הדרך היעילה ביותר לעבוד עם דאטה-בייס בשרת
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ייצוא ה-pool כדי שכל המודלים (Models) יוכלו להשתמש בו לשאילתות
export default pool;