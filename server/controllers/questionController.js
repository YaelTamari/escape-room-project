
import QuestionModel from '../models/questionModel.js';

// 1. הוספת שאלה חדשה לחדר
const createQuestion = async (req, res) => {
    const { roomId } = req.params;
    const { 
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
    } = req.body;

    if (!question_text || !correct_answer) {
        return res.status(400).json({ success: false, message: 'חובה להזין טקסט לשאלה ותשובה נכונה' });
    }

    try {
        const questionId = await QuestionModel.create(
            roomId, 
            question_text, 
            correct_answer, 
            hint_text || '',
            question_order || 1,
            success_message || '',
            story_text || '',
            question_type || 'text',
            option_a || null,
            option_b || null,
            option_c || null,
            option_d || null
        );
        res.status(201).json({ success: true, message: 'השאלה נוצרה בהצלחה!', questionId });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 2. קבלת כל השאלות של חדר ספציפי
const getRoomQuestions = async (req, res) => {
    const { roomId } = req.params;

    try {
        const questions = await QuestionModel.findByRoom(roomId);
        res.json({ success: true, questions });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 3. עדכון שאלה קיימת
const updateQuestion = async (req, res) => {
    const { id } = req.params; // ה-ID של השאלה עצמה
    const { 
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
    } = req.body;

    if (!question_text || !correct_answer) {
        return res.status(400).json({ success: false, message: 'חובה להזין טקסט לשאלה ותשובה נכונה' });
    }

    try {
        // בדיקה שהשאלה בכלל קיימת בבסיס הנתונים (מוערת לבחירתך)
        // const existingQuestion = await QuestionModel.findById(id);
        // if (!existingQuestion) {
        //     return res.status(404).json({ success: false, message: 'השאלה שאתה מנסה לעדכן לא נמצאה' });
        // }

        await QuestionModel.update(
            id, 
            question_text, 
            correct_answer, 
            hint_text || '',
            question_order || 1,
            success_message || '',
            story_text || '',
            question_type || 'text',
            option_a || null,
            option_b || null,
            option_c || null,
            option_d || null
        );
        res.json({ success: true, message: 'השאלה עודכנה בהצלחה!' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 4. מחיקת שאלה
const deleteQuestion = async (req, res) => {
    const { id } = req.params; // ה-ID של השאלה

    try {
        // בדיקה שהשאלה קיימת לפני שמוחקים (מוערת לבחירתך)
        // const existingQuestion = await QuestionModel.findById(id);
        // if (!existingQuestion) {
        //     return res.status(404).json({ success: false, message: 'השאלה שאתה מנסה למחוק לא נמצאה' });
        // }

        await QuestionModel.remove(id);
        res.json({ success: true, message: 'השאלה נמחקה בהצלחה!' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export default {
    createQuestion,
    getRoomQuestions,
    updateQuestion,
    deleteQuestion
};