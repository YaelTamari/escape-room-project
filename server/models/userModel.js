import db from '../config/db.js'; // שינוי ל-import והוספת סיומת .js

const User = {
    // מציאת משתמש לפי שם המשתמש שלו
    findByUsername: async (username) => {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0]; 
    },

    // יצירת משתמש חדש במערכת (בלי bcrypt כרגע, זוכרת? סיסמה רגילה!)
    create: async (username, password, role) => {
        const [result] = await db.query(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, password, role]
        );
        return result.insertId; 
    }
};

export default User; // שינוי ל-export default מודרני










// const db = require('../config/db'); 

// const User = {
//     findByUsername: async (username) => {
//         const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
//         return rows[0]; 
//     },

//     create: async (username, hashedPassword, role) => {
//         const [result] = await db.query(
//             'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
//             [username, hashedPassword, role]
//         );
//         return result.insertId; 
//     }
// };

// module.exports = User;