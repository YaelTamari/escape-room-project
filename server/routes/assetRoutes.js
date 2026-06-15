import express from 'express';
import { getAssetsPaginated } from '../controllers/assetController.js';

const router = express.Router();

// נתיב פתוח (GET) לשליפת המאגר
router.get('/', getAssetsPaginated);

export default router;