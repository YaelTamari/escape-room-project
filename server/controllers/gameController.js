import GameModel from '../models/gameModel.js';
import QuestionModel from '../models/questionModel.js';
import User from '../models/userModel.js';
import RoomModel from '../models/roomModel.js'; 

const enterRoom = async (req, res) => {
    const { roomId } = req.params;
    const userId = req.user.id;

    try {
        const roomDetails = await RoomModel.getFullRoomDetails(roomId);
        if (!roomDetails) {
            return res.status(404).json({ success: false, message: "החדר לא נמצא" });
        }
        const safeQuestions = await QuestionModel.findSafeByRoom(roomId);
        if (safeQuestions.length === 0) {
            return res.status(400).json({ success: false, message: "בחדר זה עדיין אין שאלות" });
        }

        const roomElements = await RoomModel.getRoomElements(roomId);

        await GameModel.createProgress(userId, roomId);

        res.json({
            success: true,
            message: "ברוכים הבאים לחדר הבריחה!",
            gameData: {
                room: roomDetails,          
                elements: roomElements,    
                questions: safeQuestions   
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const requestHint = async (req, res) => {
    const { questionId } = req.params;
    const userId = req.user.id;

    try {
        // מסמנים בדאטה-בייס שהשחקן השתמש ברמז לשאלה הזו
        await GameModel.useHint(userId, questionId);

        const question = await QuestionModel.findById(questionId);
        if (!question) return res.status(404).json({ success: false, message: "השאלה לא נמצאה" });

        res.json({ success: true, hint_text: question.hint_text });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const submitAnswer = async (req, res) => {
    const { questionId } = req.params;
    const { player_answer } = req.body; 
    const userId = req.user.id;

    try {
        const question = await QuestionModel.findById(questionId);
        if (!question) return res.status(404).json({ success: false, message: "השאלה לא נמצאה" });

        // שליפת הסטטוס הנוכחי (כדי לדעת כמה הוא טעה בעבר או אם השתמש ברמז)
        const status = await GameModel.getQuestionStatus(userId, questionId);

        if (status && status.is_correct) {
            return res.json({ success: true, isCorrect: true, message: "כבר פתרת את השאלה הזו בעבר!" });
        }

        //  בדיקה: אם התשובה שגויה!
        if (player_answer.trim().toLowerCase() !== question.correct_answer.trim().toLowerCase()) {
            await GameModel.logWrongAttempt(userId, questionId);
            
            const currentWrongCount = status ? status.wrong_attempts + 1 : 1;
            return res.status(200).json({ 
                success: true, 
                isCorrect: false, 
                message: `תשובה שגויה! זהו ניסיון כושל מספר ${currentWrongCount}. הניקוד לשאלה זו יורד.`,
                wrongAttempts: currentWrongCount
            });
        }

        //  בדיקה: אם התשובה נכונה! חישוב ניקוד דינמי
        let maxPoints = 5;
        let wrongAttemptsCount = status ? status.wrong_attempts : 0;
        let hintPenalty = (status && status.hint_used) ? 2 : 0; 
        let pointsEarned = maxPoints - wrongAttemptsCount - hintPenalty;

        if (pointsEarned < 1) {
            pointsEarned = 1; 
        }

        // עדכון שהשאלה נפתרה בהצלחה והוספת הנקודות שחושבו דינמית
        await GameModel.markQuestionCorrect(userId, questionId);
        await GameModel.updateUserPoints(userId, pointsEarned);

        res.json({
            success: true,
            isCorrect: true,
            message: `כל הכבוד! תשובה נכונה! הרווחת ${pointsEarned} נקודות מתוך 5 (טעויות: ${wrongAttemptsCount}, רמז: ${hintPenalty > 0 ? 'כן' : 'לא'}).`,
            pointsEarned
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const finishRoom = async (req, res) => {
    const { roomId } = req.params;
    const userId = req.user.id;

    try {
        await GameModel.completeRoom(userId, roomId);
        res.json({ success: true, message: "כל הכבוד! החדר סומן כהושלם בהצלחה!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

export default {
    enterRoom,
    requestHint,
    submitAnswer,
    finishRoom,
    
};
