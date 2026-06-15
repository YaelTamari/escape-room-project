import RoomModel from '../models/roomModel.js';
const getAllRooms = async (req, res) => {
    try {
        const rooms = await RoomModel.getAllRooms();

        // מחזירים ללקוח בדיוק את המבנה שה-React מצפה לקבל
        res.status(200).json({
            success: true,
            rooms: rooms
        });
    } catch (error) {
        console.error("שגיאה בשליפת חדרים:", error);
        res.status(500).json({ success: false, message: 'שגיאה בשליפת החדרים מהשרת' });
    }
};


// 1. יצירת חדר חדש
const createRoom = async (req, res) => {
    const { title,
        description,
        cover_image_id,
        bg_image_id,
        bg_audio_id,
        timer_seconds,
        min_points_required,
        difficulty_level } = req.body;
    // ה-ID של המפתח מגיע אלינו ישירות מהטוקן המאובטח! (המידלוור שתל אותו ב-req.user)
    const creatorId = req.user.id;

    try {
        const roomId = await RoomModel.create(
            title,
            description,
            creatorId,
            cover_image_id,
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
    const { title,
        description,
        cover_image_id,
        bg_image_id,
        bg_audio_id,
        timer_seconds,
        min_points_required,
        difficulty_level } = req.body;
    try {
        await RoomModel.update(
            id,
            title,
            description,
            cover_image_id,
            bg_image_id,
            bg_audio_id,
            timer_seconds,
            min_points_required,
            difficulty_level
        ); res.json({ success: true, message: "החדר עודכן בהצלחה!" });
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

const getRoomById = async (req, res) => {
    try {
        const room = await RoomModel.findById(req.params.id);
        res.json({ success: true, room: room });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


export default {
    getAllRooms,
    createRoom,
    getMyRooms,
    updateRoom,
    deleteRoom,
    getRoomById
};