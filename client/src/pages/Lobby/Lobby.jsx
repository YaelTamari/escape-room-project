import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getAllRooms } from '../../api/roomApi';

// הכלים הגנריים שלנו!
import Navbar from '../../components/Navbar/Navbar';
import Modal from '../../components/Modal/Modal';
import { useFetch } from '../../hooks/useFetch';
import styles from './Lobby.module.css'; // ייבוא ה-CSS המופרד

const Lobby = () => {
    // הוצאנו מפה את ה-logout, כי ה-Navbar שלנו מטפל בזה עכשיו
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const playerPoints = user?.points || 0;

    // 1. קריאה לשרת דרך ההוק המותאם אישית שלנו
    const { data, loading, error } = useFetch(getAllRooms, token);
    const [rooms, setRooms] = useState([]);

    // 2. סטייט להדלקת מודאל במקום ה-alert
    const [lockedMessage, setLockedMessage] = useState('');

    // כשמגיעים הנתונים מהשרת (דרך ההוק), שומרים אותם
    useEffect(() => {
        if (data && data.success) {
            setRooms(data.rooms);
        }
    }, [data]);

    // הגנת ניווט למשתמשים לא מחוברים
    useEffect(() => {
        if (!token) navigate('/login');
    }, [token, navigate]);

    const handleRoomClick = (room) => {
        if (playerPoints >= room.min_points_required) {
            navigate(`/play/${room.id}`);
        } else {
            // במקום alert מכוער, מדליקים את הסטייט של המודאל
            setLockedMessage(`החדר נעול! עליך לצבור עוד ${room.min_points_required - playerPoints} נקודות כדי להיכנס.`);
        }
    };

    const downloadCertificate = () => {
        if (!user) return; // הגנה למקרה שהנתונים עוד לא נטענו

        // 1. מכינים את הטקסט החגיגי בתוך הקובץ
        const textContent = `
👑 תעודת הצלחה רשמית - ממלכת האתגרים 👑
=========================================

כל הכבוד לגיבור/ה: ${user.username}

הוכחת תושייה, חשיבה חדה ועמדת בגבורה באתגרים!
סך הנקודות שצברת בממלכה: ${user.points} יהלומים 💎

המשך כך, עתיד גדול עוד לפניך! 🚀
=========================================
    `;

        // 2. הופכים את הטקסט לקובץ וירטואלי (Blob)
        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        const fileUrl = URL.createObjectURL(blob);

        // 3. יצירת קישור זמני והורדה אוטומטית
        const downloadLink = document.createElement('a');
        downloadLink.href = fileUrl;
        downloadLink.download = `תעודת_הצלחה_${user.username}.txt`;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // 4. ניקוי זיכרון הדפדפן
        URL.revokeObjectURL(fileUrl);
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                טוען את נתוני החדרים מהשרת... ⏳
            </div>
        );
    }

    return (
        <div className={styles.lobbyContainer}>

            {/* 3. סרגל הניווט הגנרי - העברנו לו Props של שחקן כדי שיציג את הניקוד */}
            <Navbar points={playerPoints} showProfile={true} />

            {/* אזור כותרת */}
            <div className={styles.headerSection}>
                <h1 className={styles.title}>בחר את האתגר הבא שלך</h1>
                <p className={styles.subtitle}>
                    פתור חידות מסובכות, אסוף יהלומים ופתח חדרים סודיים ברחבי המשחק.
                </p>
                <button onClick={downloadCertificate} className={styles.certificateButton}>
                    📄 הורד תעודת הצלחה
                </button>

                {error && <p className={styles.errorMessage}>{error}</p>}
            </div>

            {/* רשת החדרים */}
            <div className={styles.roomsGrid}>
                {rooms.map((room) => {
                    const isLocked = playerPoints < room.min_points_required;

                    // const defaultImage = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop";
                    // const imageUrl = room.cover_image_url ? `http://localhost:5000/${room.image_url}` : defaultImage;

                    const defaultImage = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop";

                    // תיקון: משתמשים ב-cover_image_url, מורידים את הסלאש המיותר, ועוטפים ב-encodeURI בשביל העברית!
                    const imageUrl = room.cover_image_url
                        ? encodeURI(`http://localhost:5000${room.cover_image_url}`)
                        : defaultImage;

                    return (
                        <div
                            key={room.id}
                            onClick={() => handleRoomClick(room)}
                            className={`${styles.roomCard} ${isLocked ? styles.cardLocked : styles.cardUnlocked}`}
                        >
                            {/* אזור התמונה */}
                            <div className={styles.imageArea}>
                                <img src={imageUrl} alt={room.title} className={styles.roomImage} />

                                {/* מנעול או יהלום על התמונה */}
                                <div
                                    className={styles.badge}
                                    style={{ border: `1px solid ${isLocked ? '#475569' : '#fbbf24'}` }}
                                >
                                    {isLocked ? '🔒' : '💎'}
                                </div>
                            </div>

                            {/* אזור הפרטים התחתון */}
                            <div className={styles.detailsArea}>
                                <h3 className={`${styles.roomTitle} ${isLocked ? styles.titleLocked : styles.titleUnlocked}`}>
                                    {room.title}
                                </h3>
                                <p className={styles.roomTimer}>
                                    ⏱️ זמן מוקצב לפתרון: <b>{Math.floor(room.timer_seconds / 60)} דקות</b>
                                </p>

                                <div className={`${styles.footerRow} ${isLocked ? styles.footerLocked : styles.footerUnlocked}`}>
                                    <span className={styles.difficulty}>
                                        רמה: <span className={styles.difficultyValue}>{room.difficulty_level}</span>
                                    </span>
                                    <span className={`${styles.pointsStatus} ${isLocked ? styles.pointsLocked : styles.pointsUnlocked}`}>
                                        {room.min_points_required === 0 ? 'פתוח לכולם' : `דרוש: ${room.min_points_required} נק'`}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 4. מודאל ההתראה שמחליף את ה-alert של חדר נעול */}
            {lockedMessage && (
                <Modal
                    title="החדר נעול 🔒"
                    titleColor="#f87171"
                    message={lockedMessage}
                    confirmText="הבנתי"
                    confirmType="primary"
                    onConfirm={() => setLockedMessage('')}
                />
            )}

        </div>
    );
};

export default Lobby;
