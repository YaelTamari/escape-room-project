import db from '../config/db.js';


const logWrongAttempt = async (userId, questionId) => {
    await db.query(
        `INSERT INTO player_question_status (user_id, question_id, hint_used, is_correct, wrong_attempts) 
         VALUES (?, ?, FALSE, FALSE, 1) 
         ON DUPLICATE KEY UPDATE wrong_attempts = wrong_attempts + 1`,
        [userId, questionId]
    );
};
// בדיקה האם יש כבר התקדמות קיימת לחדר הזה
const getProgress = async (userId, roomId) => {
    const [rows] = await db.query(
        'SELECT * FROM player_progress WHERE user_id = ? AND room_id = ?',
        [userId, roomId]
    );
    return rows[0];
};

// יצירת רשומת התקדמות כללית חדשה לחדר
const createProgress = async (userId, roomId) => {
    await db.query(
        'INSERT INTO player_progress (user_id, room_id, is_completed) VALUES (?, ?, FALSE) ON DUPLICATE KEY UPDATE is_completed = FALSE',
        [userId, roomId]
    );
};

// שליפת הסטטוס של שחקן מול שאלה ספציפית
const getQuestionStatus = async (userId, questionId) => {
    const [rows] = await db.query(
        'SELECT * FROM player_question_status WHERE user_id = ? AND question_id = ?',
        [userId, questionId]
    );
    return rows[0];
}; 

const useHint = async (userId, questionId) => {
    await db.query(
        `INSERT INTO player_question_status (user_id, question_id, hint_used, is_correct) 
         VALUES (?, ?, TRUE, FALSE) 
         ON DUPLICATE KEY UPDATE hint_used = TRUE`,
        [userId, questionId]
    );
};

// סימון שהשאלה נפתרה בהצלחה
const markQuestionCorrect = async (userId, questionId) => {
    await db.query(
        `INSERT INTO player_question_status (user_id, question_id, hint_used, is_correct) 
         VALUES (?, ?, FALSE, TRUE) 
         ON DUPLICATE KEY UPDATE is_correct = TRUE`,
        [userId, questionId]
    );
};

const completeRoom = async (userId, roomId) => {
    await db.query(
        'UPDATE player_progress SET is_completed = TRUE WHERE user_id = ? AND room_id = ?',
        [userId, roomId]
    );
};

// הוספת נקודות ישירות לטבלת המשתמש (users)
const updateUserPoints = async (userId, pointsToAdd) => {
    await db.query(
        'UPDATE users SET points = points + ? WHERE id = ?',
        [pointsToAdd, userId]
    );
};

export default {
    logWrongAttempt,
    getProgress,
    createProgress,
    getQuestionStatus,
    useHint,
    markQuestionCorrect,
    completeRoom,
    updateUserPoints
};
