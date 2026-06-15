import db from '../config/db.js'; 
import fs from 'fs';
import path from 'path';

// הגדרת התיקיות והסוגים שלהן
const ASSET_CONFIG = [
    { folder: 'images', type: 'image' },
    { folder: 'audio', type: 'audio' },
    { folder: 'popups', type: 'popup' } 
];

const seedFolder = async (folderName, type) => {
    const directoryPath = path.join(process.cwd(), 'public', 'assets', folderName);

    if (!fs.existsSync(directoryPath)) {
        console.log(`⚠️ התיקייה לא קיימת, מדלג: ${directoryPath}`);
        return;
    }

    const files = fs.readdirSync(directoryPath);
    let addedCount = 0;

    for (const file of files) {
        // מתעלם מקבצי מערכת כמו .DS_Store
        if (file.startsWith('.')) continue;

        const publicPath = `/assets/${folderName}/${file}`;
        const cleanName = path.parse(file).name;

        // בדיקה אם הקובץ כבר קיים ב-DB
        const [existing] = await db.execute('SELECT id FROM assets WHERE file_path = ?', [publicPath]);

        if (existing.length === 0) {
            await db.execute(
                'INSERT INTO assets (asset_type, name, file_path) VALUES (?, ?, ?)',
                [type, cleanName, publicPath]
            );
            console.log(`✅ נוסף: ${cleanName} (${type})`);
            addedCount++;
        }
    }
    return addedCount;
};

const runSeed = async () => {
    console.log('🚀 מתחיל סנכרון קבצים ל-MySQL...');
    
    let totalAdded = 0;
    for (const config of ASSET_CONFIG) {
        const count = await seedFolder(config.folder, config.type);
        totalAdded += (count || 0);
    }
    
    console.log(`🎉 סיום! סך הכל נוספו ${totalAdded} פריטים חדשים.`);
    process.exit();
};

runSeed();