import db from '../config/db.js';

// 1. יצירת חדר חדש בדאטה-בייס
const create = async (title, creatorId, bgImageId, bgAudioId, timerSeconds, minPoints, difficulty) => {
    const [result] = await db.query(
        `INSERT INTO rooms 
        (title, creator_id, bg_image_id, bg_audio_id, timer_seconds, min_points_required, difficulty_level) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [title, creatorId, bgImageId, bgAudioId, timerSeconds, minPoints, difficulty]
    );
    return result.insertId; // מחזיר את ה-ID של החדר החדש
};

// 2. מציאת כל החדרים שנוצרו על ידי מפתח ספציפי
const findByCreator = async (creatorId) => {
    const [rows] = await db.query('SELECT * FROM rooms WHERE creator_id = ?', [creatorId]);
    return rows;
};

// 3. עדכון חדר קיים
const update = async (roomId, title, bgImageId, bgAudioId, timerSeconds, minPoints, difficulty) => {
    await db.query(
        `UPDATE rooms 
        SET title = ?, bg_image_id = ?, bg_audio_id = ?, timer_seconds = ?, min_points_required = ?, difficulty_level = ? 
        WHERE id = ?`,
        [title, bgImageId, bgAudioId, timerSeconds, minPoints, difficulty, roomId]
    );
};

// 4. מחיקת חדר (בגלל שהגדרנו ON DELETE CASCADE ב-SQL, זה ימחק אוטומטית גם את השאלות שלו!)
const remove = async (roomId) => {
    await db.query('DELETE FROM rooms WHERE id = ?', [roomId]);
};

export default {
    create,
    findByCreator,
    update,
    remove
};