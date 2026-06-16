import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyRooms, deleteRoom } from '../../api/roomApi'; 

import Navbar from '../../components/Navbar/Navbar';
import RoomCard from '../../components/RoomCard/RoomCard';
import Modal from '../../components/Modal/Modal'; // הייבוא של המודאל!
import { useFetch } from '../../hooks/useFetch'; 
import styles from './DeveloperDashboard.module.css'; // ייבוא ה-CSS המופרד

const DeveloperDashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // שואבים נתונים עם ההוק שלנו
    const { data, loading, error } = useFetch(getMyRooms, token);
    const [myRooms, setMyRooms] = useState([]);

    // סטייטים חדשים לשליטה על המודאלים!
    const [roomToDelete, setRoomToDelete] = useState(null); // ישמור איזה חדר למחוק
    const [successMessage, setSuccessMessage] = useState(''); // ישמור הודעת הצלחה אם צריך

    useEffect(() => {
        if (data && data.rooms) {
            setMyRooms(data.rooms);
        }
    }, [data]);

    useEffect(() => {
        if (!token) navigate('/login');
    }, [token, navigate]);

    const handleCreateNewRoom = () => navigate('/developer/create-room');
    const handleEditRoom = (roomId) => navigate(`/developer/edit-room/${roomId}`);
    const handleManageQuestions = (roomId) => navigate(`/manage-room/${roomId}`);

    // פונקציה 1: מדליקה את מודאל האזהרה (נשלחת לכרטיסייה)
    const handleDeleteClick = (roomId) => {
        setRoomToDelete(roomId); 
    };

    // פונקציה 2: מופעלת רק אם המשתמש לחץ "כן, מחק!" בתוך המודאל
    const executeDelete = async () => {
        try {
            await deleteRoom(roomToDelete, token);
            setMyRooms(myRooms.filter(room => room.id !== roomToDelete));
            setRoomToDelete(null); // מכבה את מודאל האזהרה
            setSuccessMessage('האתגר נמחק בהצלחה! 🗑️'); // מדליק את מודאל ההצלחה
        } catch (err) {
            alert('שגיאה במחיקת האתגר.');
        }
    };

    if (loading) return <div className={styles.loading}>טוען את נתוני הדאשבורד... ⏳</div>;

    return (
        <div className={styles.dashboardContainer}>
            <Navbar />

            <div className={styles.mainContent}>
                <div className={styles.headerCard}>
                    <div>
                        <h1 className={styles.headerTitle}>ניהול האתגרים שלי</h1>
                        <p className={styles.headerSubtitle}>כאן תוכל ליצור ולנהל את ההרפתקאות שהשחקנים יחוו.</p>
                    </div>

                    <button
                        onClick={handleCreateNewRoom}
                        className={styles.createButton}
                    >
                        ➕ צור אתגר חדש
                    </button>
                </div>

                {error && <p className={styles.errorMessage}>{error}</p>}

                <h2 className={styles.sectionTitle}>היצירות שלי</h2>

                {myRooms.length === 0 ? (
                    <div className={styles.emptyState}>
                        עדיין לא יצרת אתגרים. לחץ על "צור אתגר חדש" כדי להתחיל את הקסם! ✨
                    </div>
                ) : (
                    <div className={styles.roomsGrid}>
                        {myRooms.map(room => (
                            <RoomCard 
                                key={room.id} 
                                room={room} 
                                onManage={handleManageQuestions} 
                                onEdit={handleEditRoom} 
                                onDelete={handleDeleteClick} // שלחנו את הפונקציה שרק מדליקה את המודאל
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* אזור המודאלים - הם לא תופסים מקום על המסך אלא קופצים רק כשהסטייט מתמלא */}
            
            {/* מודאל 1: אזהרה לפני מחיקה */}
            {roomToDelete && (
                <Modal 
                    title="מחיקת חדר"
                    message="האם אתה בטוח שברצונך למחוק אתגר זה לצמיתות? הפעולה הזו תמחק גם את כל החידות שבתוכו."
                    confirmText="כן, מחק הכל"
                    confirmType="danger"
                    onConfirm={executeDelete} 
                    cancelText="ביטול"
                    onCancel={() => setRoomToDelete(null)} 
                />
            )}

            {/* מודאל 2: הודעת הצלחה */}
            {successMessage && (
                <Modal 
                    title="פעולה הושלמה"
                    titleColor="#10b981"
                    message={successMessage}
                    confirmText="המשך"
                    confirmType="success"
                    onConfirm={() => setSuccessMessage('')} // לחיצה על המשך מאפסת את ההודעה וסוגרת את המודאל
                />
            )}

        </div>
    );
};

export default DeveloperDashboard;