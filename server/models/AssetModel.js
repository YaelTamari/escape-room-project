import db from '../config/db.js';

export const countAssetsByType = async (type) => {
    const [result] = await db.query('SELECT COUNT(*) as total FROM assets WHERE type = ?', [type]);
    return result[0].total;
};

export const fetchAssetsByType = async (type, limit, offset) => {
    const [assets] = await db.query(
        `SELECT id, type, name, file_url FROM assets WHERE type = ? LIMIT ? OFFSET ?`,
        [type, limit, offset]
    );
    return assets;
};