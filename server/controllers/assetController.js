import { countAssetsByType, fetchAssetsByType } from '../models/AssetModel.js';

export const getAssetsPaginated = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5; 
        const type = req.query.type;
        const offset = (page - 1) * limit;

        // 1. קריאה למודל לספירה
        const totalAssets = await countAssetsByType(type);

        // 2. קריאה למודל לשליפה
        const assets = await fetchAssetsByType(type, limit, offset);

        res.json({
            success: true,
            assets: assets, 
            hasMore: offset + assets.length < totalAssets
        });
    } catch (error) {
        console.error('Error fetching paginated assets:', error.message);
        res.status(500).json({ success: false, message: 'שגיאה במשיכת מאגר האלמנטים' });
    }
};

