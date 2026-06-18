import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './config/db.js';

// הגדרת __dirname בסביבת ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// התיקייה הראשית שבה נמצאים הנכסים (server/public/assets)
const BASE_ASSETS_DIR = path.join(__dirname, 'public', 'assets');

// מיפוי התיקיות הפיזיות לסוג ה-ENUM המתאים בבסיס הנתונים
const foldersToScan = [
    { name: 'images', type: 'image' },
    { name: 'audio', type: 'audio' },
    { name: 'popup', type: 'popup' }
];

async function seedAssets() {
    console.log('🚀 מתחיל סנכרון קבצים ל-MySQL...');
    let addedCount = 0;

    try {
        for (const folder of foldersToScan) {
            const folderPath = path.join(BASE_ASSETS_DIR, folder.name);

            // בדיקה אם התיקייה קיימת פיזית במחשב
            if (!fs.existsSync(folderPath)) {
                console.warn(`⚠️ התיקייה לא קיימת, מדלג: ${folderPath}`);
                continue;
            }

            // קריאת כל הקבצים שיש בתוך התיקייה הנוכחית
            const files = fs.readdirSync(folderPath);

            for (const file of files) {
                const filePath = path.join(folderPath, file);
                
                // מדלגים על תיקיות פנימיות או קבצי מערכת מוסתרים
                if (fs.statSync(filePath).isDirectory() || file.startsWith('.')) {
                    continue;
                }

                // חילוץ שם הקובץ ללא הסיומת עבור עמודת ה-name (למשל: "חדר עתיק")
                const cleanName = path.parse(file).name;
                
                // יצירת הנתיב הציבורי שיישמר במסד הנתונים
                const publicPath = `/assets/${folder.name}/${file}`;

                try {
                    // 1. בדיקה אם הקובץ כבר רשום (משתמש ב-file_url המעודכן)
                    const [existing] = await db.execute(
                        'SELECT id FROM assets WHERE file_url = ?', 
                        [publicPath]
                    );

                    if (existing.length === 0) {
                        // 2. במידה ולא קיים - מכניסים אותו לטבלת assets (משתמש ב-type ו-file_url)
                        await db.execute(
                            'INSERT INTO assets (type, name, file_url) VALUES (?, ?, ?)',
                            [folder.type, cleanName, publicPath]
                        );
                        console.log(`✅ נוסף בהצלחה: ${file} (${folder.type})`);
                        addedCount++;
                    }
                } catch (fileError) {
                    console.error(`❌ שגיאה בהכנסת הקובץ ${file} למסד הנתונים:`, fileError.message);
                }
            }
        }

        console.log(`\n🎉 סיום בהצלחה! סך הכל נוספו ${addedCount} פריטים חדשים.`);
    } catch (error) {
        console.error('❌ שגיאה כללית בתהליך הסנכרון:', error.message);
    } finally {
        // סגירת החיבור למסד הנתונים בצורה נקייה בסיום הריצה
        if (db && typeof db.end === 'function') {
            await db.end();
            console.log('🔌 החיבור ל-DB נסגר בצורה נקייה.');
        }
    }
}

// הפעלת הפונקציה
seedAssets();