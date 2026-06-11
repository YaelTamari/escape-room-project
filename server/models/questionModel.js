
import db from '../config/db.js';

// 1. יצירת שאלה חדשה
const create = async (
    roomId,
    questionText,
    correctAnswer,
    hintText,
    questionOrder,
    successMessage,
    storyText,
    questionType,
    optionA,
    optionB,
    optionC,
    optionD
) => {
    const [result] = await db.query(
        `INSERT INTO questions
        (
            room_id,
            question_text,
            correct_answer,
            hint_text,
            question_order,
            success_message,
            story_text,
            question_type,
            option_a,
            option_b,
            option_c,
            option_d
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            roomId,
            questionText,
            correctAnswer,
            hintText,
            questionOrder,
            successMessage,
            storyText,
            questionType,
            optionA,
            optionB,
            optionC,
            optionD
        ]
    );

    return result.insertId;
};

// 2. שליפה בטוחה (לשחקן בזמן משחק) - בלי correct_answer!
const findSafeByRoom = async (roomId) => {
    const query = `
        SELECT 
            id, room_id, question_text, question_order, 
            success_message, story_text, question_type, 
            option_a, option_b, option_c, option_d 
        FROM questions 
        WHERE room_id = ? 
        ORDER BY question_order ASC
    `;
    const [rows] = await db.query(query, [roomId]);
    return rows;
};

// 3. מציאת כל השאלות של חדר מסוים (ליוצר החדר - כולל תשובות נכונות)
const findByRoom = async (roomId) => {
    const [rows] = await db.query('SELECT * FROM questions WHERE room_id = ? ORDER BY question_order ASC', [roomId]);
    return rows;
};

// 4. מציאת שאלה ספציפית לפי ה-ID שלה
const findById = async (questionId) => {
    const [rows] = await db.query('SELECT * FROM questions WHERE id = ?', [questionId]);
    return rows[0]; // מחזיר את השאלה הבודדת או undefined
};

// 5. עדכון שאלה קיימת
const update = async (
    questionId,
    questionText,
    correctAnswer,
    hintText,
    questionOrder,
    successMessage,
    storyText,
    questionType,
    optionA,
    optionB,
    optionC,
    optionD
) => {
    await db.query(
        `UPDATE questions
         SET
            question_text = ?,
            correct_answer = ?,
            hint_text = ?,
            question_order = ?,
            success_message = ?,
            story_text = ?,
            question_type = ?,
            option_a = ?,
            option_b = ?,
            option_c = ?,
            option_d = ?
         WHERE id = ?`,
        [
            questionText,
            correctAnswer,
            hintText,
            questionOrder,
            successMessage,
            storyText,
            questionType,
            optionA,
            optionB,
            optionC,
            optionD,
            questionId
        ]
    );
};

// 6. מחיקת שאלה בודדת
const remove = async (questionId) => {
    await db.query('DELETE FROM questions WHERE id = ?', [questionId]);
};

export default {
    create,
    findSafeByRoom,
    findByRoom,
    findById,
    update,
    remove
};