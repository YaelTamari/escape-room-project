const validateAnswerSubmit = (req, res, next) => {
    const { player_answer } = req.body;

    if (player_answer === undefined || player_answer === null || player_answer.toString().trim() === '') {
        return res.status(400).json({ success: false, message: "אי אפשר לשלוח תשובה ריקה!" });
    }

    next();
};

const validateQuestionInput = (req, res, next) => {
    const { question_text, correct_answer } = req.body;

    if (!question_text || question_text.trim() === '') {
        return res.status(400).json({ success: false, message: "השאלה לא יכולה להיות ריקה" });
    }

    if (!correct_answer || correct_answer.trim() === '') {
        return res.status(400).json({ success: false, message: "חובה לספק תשובה נכונה לשאלה" });
    }

    
    next();
};

const validateRoomInput = (req, res, next) => {
    const { title, timer_seconds, difficulty_level, min_points_required } = req.body;

    if (!title || title.trim() === '') {
        return res.status(400).json({ success: false, message: "חובה לספק כותרת לחדר" });
    }
    
    if (!timer_seconds || isNaN(timer_seconds) || timer_seconds <= 0) {
        return res.status(400).json({ success: false, message: "הטיימר חייב להיות מספר גדול מאפס" });
    }

    if (difficulty_level && (isNaN(difficulty_level) || difficulty_level < 1 || difficulty_level > 5)) {
        return res.status(400).json({ success: false, message: "רמת הקושי צריכה להיות בין 1 ל-5" });
    }

    if (min_points_required && (isNaN(min_points_required) || min_points_required < 0)) {
         return res.status(400).json({ success: false, message: "מינימום נקודות חייב להיות מספר חיובי או 0" });
    }

    next(); 
};

export default { 
    validateRoomInput, 
    validateQuestionInput, 
    validateAnswerSubmit 
};