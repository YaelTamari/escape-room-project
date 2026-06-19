import express from 'express';
const router = express.Router();
import roomElementController from '../controllers/roomElementController.js';

router.get('/:roomId/elements', roomElementController.getElements);
router.post('/:roomId/elements', roomElementController.createElement);
router.delete('/elements/:id', roomElementController.deleteElement);

export default router;