import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import questionRoutes from './routes/questionRoutes.js';  
import gameRoutes from './routes/gameRoutes.js';
// הפעלת הגדרות ה-dotenv (קריאת משתני הסביבה מקובץ .env)
dotenv.config();
const app = express();

// מידלוורס גלובליים
app.use(cors());
app.use(express.json()); // מאפשר לשרת לקרוא מידע שמגיע בפורמט JSON מה-React
// חיבור הראוטים השונים של האפליקציה לשרת
app.use('/api/auth', authRoutes); // נתיבי התחברות והרשמה
app.use('/api/rooms', roomRoutes); // נתיבי ניהול החדרים (מוגנים ע"י טוקן)
app.use('/api/rooms', questionRoutes);
app.use('/api/game', gameRoutes);
// נתיב בדיקה בסיסי (Health Check) כדי לוודא שהשרת חי ומגיב
app.get('/api/health', (req, res) => {
    res.json({ status: "Server is running perfectly with Rooms and Auth!" });
});
//Catch-all 404 Middleware
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `אופס! הכתובת שחיפשת לא קיימת בשרת: ${req.originalUrl}`,
        hint: "בדקו שוב את ה-URL או את סוג הבקשה (GET/POST)"
    });
});

// הגדרת הפורט שעליו השרת יאזין
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is flying on port ${PORT} with MVC Architecture!`);
});




