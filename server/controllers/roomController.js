import RoomModel from '../models/roomModel.js';

// 1. יצירת חדר חדש
const createRoom = async (req, res) => {
    const { title, bg_image_id, bg_audio_id, timer_seconds, min_points_required, difficulty_level } = req.body;
    
    // ה-ID של המפתח מגיע אלינו ישירות מהטוקן המאובטח! (המידלוור שתל אותו ב-req.user)
    const creatorId = req.user.id; 

    try {
        const roomId = await RoomModel.create(
            title, 
            creatorId, 
            bg_image_id, 
            bg_audio_id, 
            timer_seconds, 
            min_points_required, 
            difficulty_level
        );
        res.status(201).json({ success: true, message: "החדר נוצר בהצלחה!", roomId });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 2. קבלת כל החדרים של המפתח שהתחבר
const getMyRooms = async (req, res) => {
    // גם פה, אנחנו שולפים את ה-ID מהטוקן של מי שמבקש, הכי מאובטח שיש
    const creatorId = req.user.id;

    try {
        const rooms = await RoomModel.findByCreator(creatorId);
        res.json({ success: true, rooms });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 3. עדכון חדר
const updateRoom = async (req, res) => {
    const { id } = req.params; 
    const { title, bg_image_id, bg_audio_id, timer_seconds, min_points_required, difficulty_level } = req.body;

    try {
        await RoomModel.update(id, title, bg_image_id, bg_audio_id, timer_seconds, min_points_required, difficulty_level);
        res.json({ success: true, message: "החדר עודכן בהצלחה!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 4. מחיקת חדר
const deleteRoom = async (req, res) => {
    const { id } = req.params;

    try {
        await RoomModel.remove(id);
        res.json({ success: true, message: "החדר נמחק בהצלחה!" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
export default {
    createRoom,
    getMyRooms,
    updateRoom,
    deleteRoom
};