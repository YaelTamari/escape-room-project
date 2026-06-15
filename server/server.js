import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import questionRoutes from './routes/questionRoutes.js';  
import gameRoutes from './routes/gameRoutes.js';
import assetRoutes from './routes/assetRoutes.js';

import roomElementRoutes from './routes/roomElementRoutes.js'; // שימי לב לסיומת .js, היא חובה ב-ES Modules!

// 1. ייבוא הכלים המובנים של Node לטיפול בנתיבים בשיטה המודרנית
import path from 'path';
import { fileURLToPath } from 'url';

// הפעלת הגדרות ה-dotenv
dotenv.config();
const app = express();

// 2. יצירת "מפת הניווט" שלנו (תחליף ל-__dirname הישן)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// מידלוורס גלובליים
app.use(cors());
app.use(express.json());

// 3. חשיפת תיקיית הנכסים הציבורית לעולם
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));

// app.use('/assets', express.static(path.join(process.cwd(), 'public', 'assets')));
// חיבור הראוטים (הוסיפי את השורה הבאה תחת הראוטים הקיימים):
app.use('/api/rooms', roomElementRoutes);


// חיבור הראוטים
app.use('/api/auth', authRoutes); 
app.use('/api/rooms', roomRoutes); 
app.use('/api/rooms', questionRoutes);
app.use('/api/game', gameRoutes);


app.use('/api/assets', assetRoutes);

// נתיב בדיקה בסיסי
app.get('/api/health', (req, res) => {
    res.json({ status: "Server is running perfectly with Rooms and Auth!" });
});

// Catch-all 404 Middleware
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `אופס! הכתובת שחיפשת לא קיימת בשרת: ${req.originalUrl}`,
        hint: "בדקו שוב את ה-URL או את סוג הבקשה (GET/POST)"
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is flying on port ${PORT} with MVC Architecture!`);
});
