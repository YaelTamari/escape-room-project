
import QuestionModel from '../models/questionModel.js';

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

const getRoomQuestions = async (req, res) => {
    const { roomId } = req.params;

    try {
        const questions = await QuestionModel.findByRoom(roomId);
        res.json({ success: true, questions });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const updateQuestion = async (req, res) => {
    const { id } = req.params; 
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

const deleteQuestion = async (req, res) => {
    const { id } = req.params; 

    try {
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