import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import questionRoutes from './routes/questionRoutes.js';  
import gameRoutes from './routes/gameRoutes.js';
import assetRoutes from './routes/assetRoutes.js';
import roomElementRoutes from './routes/roomElementRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));
app.use('/api/rooms', roomElementRoutes);

app.use('/api/auth', authRoutes); 
app.use('/api/rooms', roomRoutes); 
app.use('/api/rooms', questionRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/assets', assetRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: "Server is running perfectly with Rooms and Auth!" });
});

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
