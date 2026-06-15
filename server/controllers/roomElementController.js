import RoomElement from '../models/roomElementModel.js';

const roomElementController = {
    getElements: async (req, res) => {
        const { roomId } = req.params;
        try {
            const elements = await RoomElement.getAllByRoomId(roomId);
            res.json(elements);
        } catch (err) {
            res.status(500).json({ error: 'שגיאה בשליפת האלמנטים: ' + err.message });
        }
    },

    createElement: async (req, res) => {
        const { roomId } = req.params;
        const { element_type, button_label, asset_id, element_text } = req.body;

        if (!element_type || !button_label) {
            return res.status(400).json({ error: 'חובה להזין סוג אלמנט ותווית לכפתור' });
        }

        try {
            const insertedId = await RoomElement.create(roomId, {
                element_type,
                button_label,
                asset_id,
                element_text
            });
            res.status(201).json({ id: insertedId, message: 'האלמנט נוצר בהצלחה!' });
        } catch (err) {
            res.status(500).json({ error: 'שגיאה בשמירת האלמנט: ' + err.message });
        }
    },

    deleteElement: async (req, res) => {
        const { id } = req.params;
        try {
            const success = await RoomElement.delete(id);
            if (success) {
                res.json({ message: 'האלמנט נמחק בהצלחה' });
            } else {
                res.status(404).json({ error: 'האלמנט לא נמצא' });
            }
        } catch (err) {
            res.status(500).json({ error: 'שגיאה במחיקת האלמנט: ' + err.message });
        }
    }
};

export default roomElementController;