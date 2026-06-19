import db from '../config/db.js';

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

const findByRoom = async (roomId) => {
    const [rows] = await db.query('SELECT * FROM questions WHERE room_id = ? ORDER BY question_order ASC', [roomId]);
    return rows;
};

const findById = async (questionId) => {
    const [rows] = await db.query('SELECT * FROM questions WHERE id = ?', [questionId]);
    return rows[0]; 
};

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