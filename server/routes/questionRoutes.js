import express from 'express';
import questionController from '../controllers/questionController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import validationMiddleware from '../middleware/validationMiddleware.js';
const router = express.Router();

// נתיבים שדורשים את ה-ID של החדר (נפוץ ביצירה ושליפה של הכל)
router.post('/:roomId/questions', authMiddleware.verifyToken, authMiddleware.restrictTo('developer'),validationMiddleware.validateQuestionInput, questionController.createQuestion);
router.get('/:roomId/questions', authMiddleware.verifyToken, authMiddleware.restrictTo('developer'), questionController.getRoomQuestions);
router.put('/questions/update/:id', authMiddleware.verifyToken, authMiddleware.restrictTo('developer'),validationMiddleware.validateQuestionInput,questionController.updateQuestion);
router.delete('/questions/delete/:id', authMiddleware.verifyToken, authMiddleware.restrictTo('developer'), questionController.deleteQuestion);

export default router;
