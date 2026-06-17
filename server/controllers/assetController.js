// import db from '../config/db.js'; 

// export const getAssetsPaginated = async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 100; 
//         const type = req.query.type; 
//         const offset = (page - 1) * limit;

//         // 1. ספירת המלאי בטבלה
//         const [countResult] = await db.query(
//             'SELECT COUNT(*) as total FROM assets WHERE type = ?',
//             [type]
//         );
//         const totalAssets = countResult[0].total;

//         // 2. שליפת הנתונים
//         // שינוי קטן: שילבנו את ה-limit וה-offset ישירות כמספרים בתוך המחרוזת
//         // זה מונע באגים נפוצים של הדרייבר ב-MySQL עם סימני שאלה ב-LIMIT
//         const [assets] = await db.query(
//             `SELECT id, type, name, file_url 
//              FROM assets 
//              WHERE type = ? 
//              LIMIT ${limit} OFFSET ${offset}`,
//             [type]
//         );

//         res.json({
//             success: true,
//             assets: assets, 
//             hasMore: offset + assets.length < totalAssets
//         });
//     } catch (error) {
//         // הדפסה לטרמינל של השרת
//         console.error('Error fetching paginated assets from MySQL:', error.message);
        
//         // משתמשים בטכניקת דיבאג: שולחים את השגיאה האמיתית (error.message) לפרונטנד
//         // כדי שנוכל לראות אותה ישירות בלוג של הדפדפן שלך!
//         res.status(500).json({ 
//             success: false, 
//             message: 'שגיאה במשיכת מאגר האלמנטים',
//             realDatabaseError: error.message // השורה הזו תגלה לנו את האמת
//         });
//     }
// };











import db from '../config/db.js'; 

export const getAssetsPaginated = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100; // מושכים עד 100 נכסים כדי שהכל יופיע בטופס
        const type = req.query.type; 
        const offset = (page - 1) * limit;

        // 1. ספירה - משתמשים בשם העמודה המדויק מהתמונה: asset_type
        const [countResult] = await db.query(
            'SELECT COUNT(*) as total FROM assets WHERE type = ?',
            [type]
        );
        const totalAssets = countResult[0].total;

        // 2. שליפה - משתמשים ב-asset_type ו-file_url בדיוק כמו בדאטה-בייס!
        // הוספנו AS type כדי שהריאקט יהיה מרוצה
        const [assets] = await db.query(
            `SELECT id, type , name, file_url  
             FROM assets 
             WHERE type = ? 
             LIMIT ? OFFSET ?`,
            [type, limit, offset]
        );

        res.json({
            success: true,
            assets: assets, 
            hasMore: offset + assets.length < totalAssets
        });
    } catch (error) {
        console.error('Error fetching paginated assets from MySQL:', error.message);
        res.status(500).json({ success: false, message: 'שגיאה במשיכת מאגר האלמנטים' });
    }
};











// import db from '../config/db.js'; 

// export const getAssetsPaginated = async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const type = req.query.type; // 'image', 'audio', או 'popup'
//         const offset = (page - 1) * limit;

//         // 1. ספירה (חשוב לשים לב לשם העמודה המדויק)
//         const [countResult] = await db.query(
//             'SELECT COUNT(*) as total FROM assets WHERE asset_type = ?',
//             [type]
//         );
//         const totalAssets = countResult[0].total;

//         // 2. שליפה (כאן נעשה את ה-AS כדי שה-React יקבל מה שהוא מצפה לו)
//         const [assets] = await db.query(
//             `SELECT id, asset_type AS type, name, file_path AS file_url 
//              FROM assets 
//              WHERE asset_type = ? 
//              LIMIT ? OFFSET ?`,
//             [type, limit, offset]
//         );

//         res.json({
//             success: true,
//             assets: assets, // כאן ה-assets יגיעו עם השדות: id, type, name, file_url
//             hasMore: offset + assets.length < totalAssets
//         });
//     } catch (error) {
//         console.error('Error fetching paginated assets:', error);
//         res.status(500).json({ success: false, message: 'שגיאה במשיכת מאגר האלמנטים' });
//     }
// };

















// import db from '../config/db.js'; // השורה הקריטית שחסרה לנו!
// export const getAssetsPaginated = async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const type = req.query.type; // 'image' או 'audio'
//         const offset = (page - 1) * limit;

//         // סופרים כמה פריטים יש בסך הכל (עם השם החדש והנקי: type)
//         const [countResult] = await db.query(
//             'SELECT COUNT(*) as total FROM assets WHERE type = ?',
//             [type]
//         );
//         const totalAssets = countResult[0].total;

//         // שולפים את הנתונים (עם השמות החדשים והנקיים: type, file_url)
//         const [assets] = await db.query(
//             'SELECT id, type, name, file_url FROM assets WHERE type = ? LIMIT ? OFFSET ?',
//             [type, limit, offset]
//         );

//         res.json({
//             success: true,
//             assets: assets,
//             hasMore: offset + assets.length < totalAssets
//         });
//     } catch (error) {
//         console.error('Error fetching paginated assets:', error);
//         res.status(500).json({ success: false, message: 'שגיאה במשיכת מאגר האלמנטים' });
//     }
// };











// import db from '../config/db.js';

// export const getAssetsPaginated = async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const type = req.query.type; // 'image' או 'audio' שמגיע מהריאקט
//         const offset = (page - 1) * limit;

//         // 1. סופרים כמה פריטים יש בסך הכל (שימי לב ששינינו ל- asset_type)
//         const [countResult] = await db.query(
//             'SELECT COUNT(*) as total FROM assets WHERE asset_type = ?',
//             [type]
//         );
//         const totalAssets = countResult[0].total;

//         // 2. שולפים את הנתונים ועושים המרה חכמה לשמות שהריאקט מצפה לקבל
//         const [assets] = await db.query(
//             'SELECT id, asset_type AS type, name, file_path AS file_url FROM assets WHERE asset_type = ? LIMIT ? OFFSET ?',
//             [type, limit, offset]
//         );

//         res.json({
//             success: true,
//             assets: assets,
//             hasMore: offset + assets.length < totalAssets
//         });
//     } catch (error) {
//         console.error('Error fetching paginated assets:', error);
//         res.status(500).json({ success: false, message: 'שגיאה במשיכת מאגר האלמנטים' });
//     }
// };



// import db from '../config/db.js';

// export const getAssetsPaginated = async (req, res) => {
//     try {
//         // 1. מקבלים את הפרמטרים מהבקשה (עם ערכי ברירת מחדל אם לא סופקו)
//         const type = req.query.type; // 'image' או 'audio'
//         const page = parseInt(req.query.page) || 1; // איזה עמוד אנחנו מבקשים
//         const limit = parseInt(req.query.limit) || 10; // כמה פריטים בכל בקשה
        
//         // 2. חישוב הדילוג (OFFSET)
//         // לדוגמה: עמוד 1 -> מדלגים על 0. עמוד 2 -> מדלגים על 10.
//         const offset = (page - 1) * limit;

//         // 3. שליפת הנתונים מהמסד עם LIMIT ו-OFFSET
//         // אנחנו משתמשים בסימן שאלה (?) כדי למנוע פריצות SQL Injection
//         const query = 'SELECT * FROM assets WHERE type = ? LIMIT ? OFFSET ?';
//         const [assets] = await db.execute(query, [type, limit, offset]);

//         // 4. בדיקה האם יש עוד פריטים במאגר (כדי לדעת אם להציג כפתור "הצג עוד")
//         const countQuery = 'SELECT COUNT(*) as total FROM assets WHERE type = ?';
//         const [[{ total }]] = await db.execute(countQuery, [type]);
        
//         // מחשבים האם נשארו עוד פריטים
//         const hasMore = offset + assets.length < total;

//         res.status(200).json({
//             success: true,
//             assets: assets,
//             hasMore: hasMore // נחזיר ל-React True או False
//         });
//     } catch (error) {
//         console.error('Error fetching paginated assets:', error);
//         res.status(500).json({ success: false, message: 'שגיאה בשליפת מאגר האלמנטים.' });
//     }
// };