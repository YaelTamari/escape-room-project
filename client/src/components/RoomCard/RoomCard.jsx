import React from 'react';
import styles from './RoomCard.module.css';

// הכרטיסייה מקבלת את נתוני החדר ואת פונקציות הלחיצה כ-Props
const RoomCard = ({ room, onManage, onEdit, onDelete }) => {
    return (
        <div className={styles.card}>

            {/* 1. הוספת תמונת החדר ללובי - משתמשת בכתובת המלאה ומטפלת ברווחים ועברית */}
            {room.cover_image_url && (
                <div className={styles.imageWrapper}>
                    <img 
                        src={encodeURI(`http://localhost:5000${room.cover_image_url}`)} 
                        alt={room.title} 
                        className={styles.cardImage} 
                    />
                </div>
            )}

            <h3 className={styles.title}>{room.title}</h3>
            
            <p className={styles.timer}>
                ⏱️ זמן: {Math.floor(room.timer_seconds / 60)} דקות
            </p>

            <div className={styles.buttonGroup}>
                <button 
                    onClick={() => onManage(room.id)} 
                    className={`${styles.button} ${styles.manageBtn}`}
                >
                    🧩 ניהול חידות
                </button>
                
                <button 
                    onClick={() => onEdit(room.id)} 
                    className={`${styles.button} ${styles.editBtn}`}
                >
                    ✏️ עריכה
                </button>
                
                <button 
                    onClick={() => onDelete(room.id)} 
                    className={`${styles.button} ${styles.deleteBtn}`}
                >
                    🗑️ מחיקה
                </button>
            </div>
        </div>
    );
};

export default RoomCard;