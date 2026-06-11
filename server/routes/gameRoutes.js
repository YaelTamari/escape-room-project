import express from 'express';
import gameController from '../controllers/gameController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import validationMiddleware from '../middleware/validationMiddleware.js';

const router = express.Router();

// כל פעולות המשחק דורשות משתמש מחובר (בין אם הוא פלייר או מפתח שבודק את החדר)
router.post('/room/:roomId/enter', authMiddleware.verifyToken, authMiddleware.restrictTo('player'), gameController.enterRoom);
router.post('/question/:questionId/hint', authMiddleware.verifyToken, authMiddleware.restrictTo('player'), gameController.requestHint);
router.post('/question/:questionId/submit', authMiddleware.verifyToken, authMiddleware.restrictTo('player'),validationMiddleware.validateAnswerSubmit, gameController.submitAnswer);
router.post('/room/:roomId/finish', authMiddleware.verifyToken, authMiddleware.restrictTo('player'), gameController.finishRoom);
// כולם יכולים לראות את טבלת המובילים (לכן verifyToken רגיל מספיק פה)
router.get('/leaderboard', authMiddleware.verifyToken, gameController.getLeaderboard);
export default router;