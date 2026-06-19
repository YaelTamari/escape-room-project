import db from '../config/db.js'; 

const User = {

    findByUsername: async (username) => {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0]; 
    },

    create: async (username, password, role) => {
        const [result] = await db.query(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, password, role]
        );
        return result.insertId; 
    }
    ,
    getTopPlayers: async () => {
        const [rows] = await db.query(
            'SELECT username, points FROM users WHERE role = "player" ORDER BY points DESC LIMIT 10'
        );
        return rows;
    }
};

export default User;
