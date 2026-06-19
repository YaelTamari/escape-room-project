import db from '../config/db.js';

const getAllRooms = async () => {
    const query = `
        SELECT rooms.*, bg_assets.file_url AS cover_image_url 
        FROM rooms 
        LEFT JOIN assets AS bg_assets ON rooms.bg_image_id = bg_assets.id
    `;
    const [rows] = await db.query(query);
    return rows;
};

const getFullRoomDetails = async (roomId) => {
    const query = `
        SELECT r.id, r.title, r.description, r.timer_seconds, r.difficulty_level,
               img.file_url AS bg_image_url,
               aud.file_url AS bg_audio_url
        FROM rooms r
        LEFT JOIN assets img ON r.bg_image_id = img.id
        LEFT JOIN assets aud ON r.bg_audio_id = aud.id
        WHERE r.id = ?
    `;
    const [rows] = await db.query(query, [roomId]);
    return rows[0];
};

const getRoomElements = async (roomId) => {
    const query = `
        SELECT e.id, e.element_type, e.button_label, a.file_url AS asset_url, e.element_text 
        FROM room_elements e
        LEFT JOIN assets a ON e.asset_id = a.id
        WHERE e.room_id = ?
    `;
    const [rows] = await db.query(query, [roomId]);
    return rows;
};

const create = async (title, description, creatorId, coverImageId, bgImageId, bgAudioId, timerSeconds, minPoints, difficulty) => {
    const [result] = await db.query(
        `INSERT INTO rooms 
        (title, description, creator_id, cover_image_id, bg_image_id, bg_audio_id, timer_seconds, min_points_required, difficulty_level) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, description, creatorId, coverImageId, bgImageId, bgAudioId, timerSeconds, minPoints, difficulty]
    );
    return result.insertId;
};

const findByCreator = async (creatorId) => {
    const query = `
        SELECT rooms.*, cover_assets.file_url AS cover_image_url 
        FROM rooms 
        LEFT JOIN assets AS cover_assets ON rooms.cover_image_id = cover_assets.id
        WHERE rooms.creator_id = ?
    `;
    const [rows] = await db.query(query, [creatorId]);
    return rows;
};

const update = async (roomId, title, description, coverImageId, bgImageId, bgAudioId, timerSeconds, minPoints, difficulty) => {
    await db.query(
        `UPDATE rooms 
        SET title = ?, description = ?, cover_image_id = ?, bg_image_id = ?, bg_audio_id = ?, timer_seconds = ?, min_points_required = ?, difficulty_level = ? 
        WHERE id = ?`,
        [title, description, coverImageId, bgImageId, bgAudioId, timerSeconds, minPoints, difficulty, roomId]
    );
};

const remove = async (roomId) => {
    await db.query('DELETE FROM rooms WHERE id = ?', [roomId]);
};

const findById = async (roomId) => {
    const [rows] = await db.query('SELECT * FROM rooms WHERE id = ?', [roomId]);
    return rows[0]; 
};

export default {
    getAllRooms,
    getFullRoomDetails,
    getRoomElements,
    create,
    findByCreator,
    update,
    remove,
    findById
};

