import db from '../config/db.js'; // ודאי שנתיב החיבור ל-DB נכון וכולל סיומת .js

const RoomElement = {
    // שליפת כל האלמנטים של חדר + נתיב הקובץ מה-assets אם קיים
    getAllByRoomId: async (roomId) => {
        const [rows] = await db.execute(
            `SELECT re.*, a.file_url, a.name as asset_name 
             FROM room_elements re 
             LEFT JOIN assets a ON re.asset_id = a.id 
             WHERE re.room_id = ?`, 
            [roomId]
        );
        return rows;
    },

    // יצירת אלמנט חדש
    create: async (roomId, elementData) => {
        const { element_type, button_label, asset_id, element_text } = elementData;
        const [result] = await db.execute(
            `INSERT INTO room_elements (room_id, element_type, button_label, asset_id, element_text) 
             VALUES (?, ?, ?, ?, ?)`,
            [roomId, element_type, button_label, asset_id || null, element_text || null]
        );
        return result.insertId;
    },

    // מחיקת אלמנט
    delete: async (id) => {
        const [result] = await db.execute('DELETE FROM room_elements WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

export default RoomElement;