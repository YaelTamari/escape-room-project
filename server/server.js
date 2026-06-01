import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';

// הפעלת הגדרות ה-dotenv (קריאת משתני הסביבה מקובץ .env)
dotenv.config();

const app = express();

// מידלוורס גלובליים
app.use(cors());
app.use(express.json()); // מאפשר לשרת לקרוא מידע שמגיע בפורמט JSON מה-React

// חיבור הראוטים השונים של האפליקציה לשרת
app.use('/api/auth', authRoutes); // נתיבי התחברות והרשמה
app.use('/api/rooms', roomRoutes); // נתיבי ניהול החדרים (מוגנים ע"י טוקן)

// נתיב בדיקה בסיסי (Health Check) כדי לוודא שהשרת חי ומגיב
app.get('/api/health', (req, res) => {
    res.json({ status: "Server is running perfectly with Rooms and Auth!" });
});

// הגדרת הפורט שעליו השרת יאזין
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is flying on port ${PORT} with MVC Architecture!`);
});








// import express from 'express';
// import cors from 'cors';
// import authRoutes from './routes/authRoutes.js';
// import roomRoutes from './routes/roomRoutes.js'; // 1. מייבאים את ראוטי החדרים
// require('dotenv').config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// // חיבור הראוטים
// app.use('/api/auth', authRoutes);
// app.use('/api/rooms', roomRoutes); // 2. מחברים לשרת

// app.get('/api/health', (req, res) => {
//     res.json({ status: "Server is running perfectly!" });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server is flying on port ${PORT} with MVC Architecture!`);
// });