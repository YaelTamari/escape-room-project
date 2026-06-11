import express from 'express';
import roomController from '../controllers/roomController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import validationMiddleware from '../middleware/validationMiddleware.js';

const router = express.Router();
router.get('/',
     authMiddleware.verifyToken,
      roomController.getAllRooms);
// חסימה הרמטית וולידציה: יצירת חדר דורשת טוקן, הרשאת מפתח, ונתונים תקינים
// שליפת החדרים של המפתח שהתחבר
router.get('/my-rooms',
    authMiddleware.verifyToken,
    authMiddleware.restrictTo('developer'),
    roomController.getMyRooms
);
router.post('/create',
    authMiddleware.verifyToken,
    authMiddleware.restrictTo('developer'),
    validationMiddleware.validateRoomInput,
    roomController.createRoom
);

// עדכון ומחיקה של חדרים
router.put('/update/:id',
    authMiddleware.verifyToken,
    authMiddleware.restrictTo('developer'),
    validationMiddleware.validateRoomInput,
    roomController.updateRoom
);

router.delete('/delete/:id',
    authMiddleware.verifyToken,
    authMiddleware.restrictTo('developer'),
    roomController.deleteRoom
);

export default router;