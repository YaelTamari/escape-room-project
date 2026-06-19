import express from 'express';
import { getAssetsPaginated } from '../controllers/assetController.js';

const router = express.Router();

router.get('/', getAssetsPaginated);

export default router;