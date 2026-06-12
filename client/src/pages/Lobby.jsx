import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getAllRooms } from '../api/roomApi';

// הכלים הגנריים שלנו!
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import { useFetch } from '../hooks/useFetch';

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
            navigate(`/room/${room.id}`);
        } else {
            // במקום alert מכוער, מדליקים את הסטייט של המודאל
            setLockedMessage(`החדר נעול! עליך לצבור עוד ${room.min_points_required - playerPoints} נקודות כדי להיכנס.`);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a', color: '#60a5fa', fontSize: '24px', fontFamily: 'sans-serif' }}>
                טוען את נתוני החדרים מהשרת... ⏳
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
           
            {/* 3. סרגל הניווט הגנרי - העברנו לו Props של שחקן כדי שיציג את הניקוד */}
            <Navbar points={playerPoints} showProfile={true} />

            {/* אזור כותרת */}
            <div style={{ textAlign: 'center', padding: '50px 20px 30px' }}>
                <h1 style={{ fontSize: '42px', margin: '0 0 15px 0', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>בחר את האתגר הבא שלך</h1>
                <p style={{ color: '#94a3b8', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
                    פתור חידות מסובכות, אסוף יהלומים ופתח חדרים סודיים ברחבי המשחק.
                </p>
                {error && <p style={{ color: '#ef4444', marginTop: '20px', fontWeight: 'bold', backgroundColor: 'rgba(239,68,68,0.1)', padding: '10px', borderRadius: '8px', display: 'inline-block' }}>{error}</p>}
            </div>

            {/* רשת החדרים */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '35px', flexWrap: 'wrap', padding: '0 40px 60px', maxWidth: '1200px', margin: '0 auto' }}>
                {rooms.map((room) => {
                    const isLocked = playerPoints < room.min_points_required;
                   
                    const defaultImage = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop";
                    const imageUrl = room.cover_image_url ? `http://localhost:5000/${room.image_url}` : defaultImage;

                    return (
                        <div
                            key={room.id}
                            onClick={() => handleRoomClick(room)}
                            style={{
                                width: '320px',
                                backgroundColor: '#1e293b',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                border: `2px solid ${isLocked ? '#475569' : '#3b82f6'}`,
                                opacity: isLocked ? 0.75 : 1,
                                filter: isLocked ? 'grayscale(85%)' : 'none',
                                position: 'relative',
                                transition: 'all 0.3s ease',
                                boxShadow: isLocked ? 'none' : '0 10px 15px -3px rgba(59, 130, 246, 0.2)'
                            }}
                        >
                            {/* אזור התמונה */}
                            <div style={{ height: '200px', position: 'relative' }}>
                                <img src={imageUrl} alt={room.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                               
                                {/* מנעול או יהלום על התמונה */}
                                <div style={{
                                    position: 'absolute', top: '15px', right: '15px', fontSize: '24px',
                                    backgroundColor: 'rgba(15, 23, 42, 0.85)', width: '45px', height: '45px',
                                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                                    borderRadius: '50%', border: `1px solid ${isLocked ? '#475569' : '#fbbf24'}`
                                }}>
                                    {isLocked ? '🔒' : '💎'}
                                </div>
                            </div>

                            {/* אזור הפרטים התחתון */}
                            <div style={{ padding: '25px 20px' }}>
                                <h3 style={{ margin: '0 0 10px 0', fontSize: '22px', color: isLocked ? '#cbd5e1' : '#ffffff' }}>
                                    {room.title}
                                </h3>
                               
                                <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 20px 0' }}>
                                    ⏱️ זמן מוקצב לפתרון: <b>{Math.floor(room.timer_seconds / 60)} דקות</b>
                                </p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${isLocked ? '#334155' : '#1e3a8a'}`, paddingTop: '15px' }}>
                                    <span style={{ fontSize: '15px', color: '#94a3b8' }}>
                                        רמה: <span style={{ color: '#e2e8f0', fontWeight: 'bold' }}>{room.difficulty_level}</span>
                                    </span>
                                    <span style={{ fontSize: '15px', fontWeight: 'bold', color: isLocked ? '#f87171' : '#4ade80' }}>
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





// import React, { useContext, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import { getAllRooms } from '../api/roomApi';

// const Lobby = () => {
//     const { user, logout } = useContext(AuthContext);
//     const navigate = useNavigate();

//     const [rooms, setRooms] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const token = localStorage.getItem('token');
//     const playerPoints = user?.points || 0;

//     useEffect(() => {
//         const fetchRooms = async () => {
//             try {
//                 const data = await getAllRooms(token);
//                 if (data.success) {
//                     setRooms(data.rooms);
//                 }
//             } catch (err) {
//                 setError(err.response?.data?.message || 'שגיאה בתקשורת מול השרת.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (token) {
//             fetchRooms();
//         } else {
//             navigate('/login');
//         }
//     }, [token, navigate]);

//     const handleLogout = () => {
//         logout();
//         navigate('/login');
//     };

//     const handleRoomClick = (room) => {
//         if (playerPoints >= room.min_points_required) {
//             navigate(`/room/${room.id}`);
//         } else {
//             alert(`החדר נעול! עליך לצבור עוד ${room.min_points_required - playerPoints} נקודות כדי להיכנס.`);
//         }
//     };

//     if (loading) {
//         return (
//             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a', color: '#60a5fa', fontSize: '24px', fontFamily: 'sans-serif' }}>
//                 טוען את נתוני החדרים מהשרת... ⏳
//             </div>
//         );
//     }

//     return (
//         <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
            
//             {/* סרגל ניווט עליון */}
//             <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#1e293b', borderBottom: '2px solid #3b82f6', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}>
//                 <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
//                     <h2 style={{ margin: 0, color: '#60a5fa', letterSpacing: '1px' }}>EscapeMaster</h2>
//                     <button onClick={() => navigate('/profile')} style={navButtonStyle}>הפרופיל שלי 👤</button>
//                 </div>
                
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
//                     <span style={{ fontSize: '17px' }}>שלום, <b style={{ color: '#e2e8f0' }}>{user?.username}</b></span>
//                     <span style={{ fontSize: '16px', color: '#fbbf24', fontWeight: 'bold', backgroundColor: 'rgba(251, 191, 36, 0.1)', padding: '6px 16px', borderRadius: '20px', border: '1px solid #fbbf24' }}>
//                         נקודות: {playerPoints} 💎
//                     </span>
//                     <button onClick={handleLogout} style={{ ...navButtonStyle, color: '#f87171' }}>
//                         התנתקות 🚪
//                     </button>
//                 </div>
//             </nav>

//             {/* אזור כותרת */}
//             <div style={{ textAlign: 'center', padding: '50px 20px 30px' }}>
//                 <h1 style={{ fontSize: '42px', margin: '0 0 15px 0', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>בחר את האתגר הבא שלך</h1>
//                 <p style={{ color: '#94a3b8', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
//                     פתור חידות מסובכות, אסוף יהלומים ופתח חדרים סודיים ברחבי המשחק.
//                 </p>
//                 {error && <p style={{ color: '#ef4444', marginTop: '20px', fontWeight: 'bold', backgroundColor: 'rgba(239,68,68,0.1)', padding: '10px', borderRadius: '8px', display: 'inline-block' }}>{error}</p>}
//             </div>

//             {/* רשת החדרים */}
//             <div style={{ display: 'flex', justifyContent: 'center', gap: '35px', flexWrap: 'wrap', padding: '0 40px 60px', maxWidth: '1200px', margin: '0 auto' }}>
//                 {rooms.map((room) => {
//                     const isLocked = playerPoints < room.min_points_required;
                    
//                     // טיפול בתמונה: אם יש נתיב מה-SQL נשתמש בו (צריך שהשרת יגיש קבצים סטטיים), אחרת תמונת ברירת מחדל
//                     const defaultImage = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop";
//                     const imageUrl = room.cover_image_url ? `http://localhost:5000/${room.image_url}` : defaultImage;

//                     return (
//                         <div 
//                             key={room.id}
//                             onClick={() => handleRoomClick(room)}
//                             style={{
//                                 width: '320px',
//                                 backgroundColor: '#1e293b',
//                                 borderRadius: '16px',
//                                 overflow: 'hidden',
//                                 cursor: 'pointer',
//                                 border: `2px solid ${isLocked ? '#475569' : '#3b82f6'}`,
//                                 opacity: isLocked ? 0.75 : 1,
//                                 filter: isLocked ? 'grayscale(85%)' : 'none',
//                                 position: 'relative',
//                                 transition: 'all 0.3s ease',
//                                 boxShadow: isLocked ? 'none' : '0 10px 15px -3px rgba(59, 130, 246, 0.2)'
//                             }}
//                         >
//                             {/* אזור התמונה */}
//                             <div style={{ height: '200px', position: 'relative' }}>
//                                 <img src={imageUrl} alt={room.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                
//                                 {/* מנעול או יהלום על התמונה */}
//                                 <div style={{ 
//                                     position: 'absolute', top: '15px', right: '15px', fontSize: '24px', 
//                                     backgroundColor: 'rgba(15, 23, 42, 0.85)', width: '45px', height: '45px', 
//                                     display: 'flex', justifyContent: 'center', alignItems: 'center', 
//                                     borderRadius: '50%', border: `1px solid ${isLocked ? '#475569' : '#fbbf24'}` 
//                                 }}>
//                                     {isLocked ? '🔒' : '💎'}
//                                 </div>
//                             </div>

//                             {/* אזור הפרטים התחתון */}
//                             <div style={{ padding: '25px 20px' }}>
//                                 <h3 style={{ margin: '0 0 10px 0', fontSize: '22px', color: isLocked ? '#cbd5e1' : '#ffffff' }}>
//                                     {room.title}
//                                 </h3>
                                
//                                 <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 20px 0' }}>
//                                     ⏱️ זמן מוקצב לפתרון: <b>{Math.floor(room.timer_seconds / 60)} דקות</b>
//                                 </p>

//                                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${isLocked ? '#334155' : '#1e3a8a'}`, paddingTop: '15px' }}>
//                                     <span style={{ fontSize: '15px', color: '#94a3b8' }}>
//                                         רמה: <span style={{ color: '#e2e8f0', fontWeight: 'bold' }}>{room.difficulty_level}</span>
//                                     </span>
//                                     <span style={{ fontSize: '15px', fontWeight: 'bold', color: isLocked ? '#f87171' : '#4ade80' }}>
//                                         {room.min_points_required === 0 ? 'פתוח לכולם' : `דרוש: ${room.min_points_required} נק'`}
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// };

// // עיצוב חוזר לכפתורי הנאב-בר
// const navButtonStyle = {
//     background: 'transparent',
//     border: 'none',
//     color: '#cbd5e1',
//     fontSize: '16px',
//     cursor: 'pointer',
//     fontWeight: '500',
//     transition: 'color 0.2s',
// };

// export default Lobby;