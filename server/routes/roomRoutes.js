import express from 'express';
import roomController from '../controllers/roomController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import validationMiddleware from '../middleware/validationMiddleware.js';

const router = express.Router();
router.get('/',authMiddleware.verifyToken,roomController.getAllRooms);
router.get('/my-rooms',authMiddleware.verifyToken,authMiddleware.restrictTo('developer'),roomController.getMyRooms);
router.post('/create',authMiddleware.verifyToken,authMiddleware.restrictTo('developer'),validationMiddleware.validateRoomInput,roomController.createRoom);
router.put('/update/:id',authMiddleware.verifyToken,authMiddleware.restrictTo('developer'),validationMiddleware.validateRoomInput,roomController.updateRoom);
router.delete('/delete/:id',authMiddleware.verifyToken,authMiddleware.restrictTo('developer'),roomController.deleteRoom);
router.get('/:id',authMiddleware.verifyToken,authMiddleware.restrictTo('developer'),roomController.getRoomById);

export default router;