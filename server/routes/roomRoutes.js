import express from 'express';
import roomController from '../controllers/roomController.js'; // התיקון פה! מפנים ל-roomController
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// כל הנתיבים פה מוגנים על ידי ה-verifyDeveloper!
router.post('/create', authMiddleware.verifyDeveloper, roomController.createRoom);
router.get('/my-rooms', authMiddleware.verifyDeveloper, roomController.getMyRooms);
router.put('/update/:id', authMiddleware.verifyDeveloper, roomController.updateRoom);
router.delete('/delete/:id', authMiddleware.verifyDeveloper, roomController.deleteRoom);

export default router;






// import express from 'express';
// import roomController from '../controllers/authController.js';
// import authMiddleware from '../middleware/authMiddleware.js';

// const router = express.Router();

// // כל הנתיבים פה מוגנים על ידי ה-verifyDeveloper!
// router.post('/create', authMiddleware.verifyDeveloper, roomController.createRoom);
// router.get('/my-rooms', authMiddleware.verifyDeveloper, roomController.getMyRooms);
// router.put('/update/:id', authMiddleware.verifyDeveloper, roomController.updateRoom);
// router.delete('/delete/:id', authMiddleware.verifyDeveloper, roomController.deleteRoom);

// export default router;