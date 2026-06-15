import express from 'express';
const router = express.Router();
import roomElementController from '../controllers/roomElementController.js';

// שימי לב שהקובץ הראשי מאזין ב- '/api/rooms', אז הנתיבים כאן הם יחסיים לזה:
// הכתובת המלאה תהיה: GET /api/rooms/:roomId/elements
router.get('/:roomId/elements', roomElementController.getElements);

// הכתובת המלאה תהיה: POST /api/rooms/:roomId/elements
router.post('/:roomId/elements', roomElementController.createElement);

// הכתובת המלאה תהיה: DELETE /api/rooms/elements/:id
router.delete('/elements/:id', roomElementController.deleteElement);

export default router;