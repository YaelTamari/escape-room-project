
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '../api/roomApi';

// ייבוא הקומפוננטות שלנו!
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';

const CreateRoom = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        timer_minutes: 15,
        difficulty_level: 1,
        min_points_required: 0,
        cover_image_id: 1,
        bg_image_id: 1    
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
   
    // סטייט חדש שמנהל את חלון ההצלחה (המודאל) ולאיפה מנווטים אחריו
    const [successModal, setSuccessModal] = useState({ show: false, nextRoute: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const roomDataForServer = {
                title: formData.title,
                description: formData.description,
                timer_seconds: formData.timer_minutes * 60,
                difficulty_level: formData.difficulty_level,
                min_points_required: formData.min_points_required,
                cover_image_id: formData.cover_image_id,
                bg_image_id: formData.bg_image_id,      
                bg_audio_id: null
            };

            const data = await createRoom(roomDataForServer, token);

            if (data.success) {
                const newRoomId = data.roomId || data.id;

                if (newRoomId) {
                    // במקום alert - מדליקים את המודאל ואומרים לו לאן לנווט בסוף
                    setSuccessModal({ show: true, nextRoute: `/manage-room/${newRoomId}` });
                } else {
                    setSuccessModal({ show: true, nextRoute: '/developer' });
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'שגיאה ביצירת האתגר. אנא נסה שוב.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: 'sans-serif', direction: 'rtl' }}>
           
            {/* הסרגל העליון החכם שלנו! */}
            <Navbar />

            <div style={{ padding: '40px 20px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e5e7eb', paddingBottom: '20px', marginBottom: '30px' }}>
                        <h1 style={{ margin: 0, color: '#8b5cf6' }}>שלב 1: הגדרות החדר</h1>
                        <button type="button" onClick={() => navigate('/developer')} style={{ background: 'none', border: '1px solid #d1d5db', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer' }}>
                            ביטול וחזרה
                        </button>
                    </div>

                    {error && <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '10px', borderRadius: '6px', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                        {/* כותרת ותיאור */}
                        <div>
                            <label style={labelStyle}>שם האתגר (יופיע בלובי):</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} required style={inputStyle} placeholder="לדוגמה: הפריצה למעבדת הסייבר..." />
                        </div>

                        <div>
                            <label style={labelStyle}>סיפור עלילתי (יופיע לשחקן בתחילת המשחק):</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} required style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} placeholder="מה סיפור המסגרת? מה מטרת השחקן?"></textarea>
                        </div>

                        <hr style={{ border: '1px solid #f3f4f6', margin: '10px 0' }} />

                        {/* בחירת התמונות */}
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '250px' }}>
                                <label style={labelStyle}>תמונת שער (ללובי המשחקים):</label>
                                <select name="cover_image_id" value={formData.cover_image_id} onChange={handleChange} style={inputStyle}>
                                    <option value="1">💻 דלת פלדה נעולה</option>
                                    <option value="2">🌲 שער ליער עבות</option>
                                    <option value="3">🏰 מבצר עתיק מבחוץ</option>
                                    <option value="4">🏢 בניין משרדים יוקרתי</option>
                                </select>
                                <small style={{ color: '#6b7280', marginTop: '4px', display: 'block' }}>תמונה זו תמשוך את השחקנים להיכנס.</small>
                            </div>

                            <div style={{ flex: 1, minWidth: '250px' }}>
                                <label style={labelStyle}>תמונת רקע (בתוך המשחק עצמו):</label>
                                <select name="bg_image_id" value={formData.bg_image_id} onChange={handleChange} style={inputStyle}>
                                    <option value="1">💻 מעבדת האקרים מבפנים</option>
                                    <option value="2">🌲 קרחת יער חשוכה</option>
                                    <option value="3">🏰 אולם אבירים עם לפידים</option>
                                    <option value="4">🏢 משרד מנכ"ל הפוך</option>
                                </select>
                                <small style={{ color: '#6b7280', marginTop: '4px', display: 'block' }}>הרקע שעליו יופיעו הטיימר והחידות.</small>
                            </div>
                        </div>

                        <hr style={{ border: '1px solid #f3f4f6', margin: '10px 0' }} />

                        {/* הגדרות טכניות */}
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '150px' }}>
                                <label style={labelStyle}>זמן לפתרון (בדקות):</label>
                                <input type="number" name="timer_minutes" min="1" max="120" value={formData.timer_minutes} onChange={handleChange} required style={inputStyle} />
                            </div>
                            <div style={{ flex: 1, minWidth: '150px' }}>
                                <label style={labelStyle}>רמת קושי (1-5):</label>
                                <input type="number" name="difficulty_level" min="1" max="5" value={formData.difficulty_level} onChange={handleChange} required style={inputStyle} />
                            </div>
                            <div style={{ flex: 1, minWidth: '150px' }}>
                                <label style={labelStyle}>נקודות דרושות לכניסה:</label>
                                <input type="number" name="min_points_required" min="0" step="10" value={formData.min_points_required} onChange={handleChange} required style={inputStyle} />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} style={{ marginTop: '30px', padding: '16px', backgroundColor: '#8b5cf6', color: 'white', fontSize: '18px', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s' }}>
                            {loading ? 'שומר חדר...' : 'המשך לשלב 2: הוספת חידות ➔'}
                        </button>
                    </form>
                </div>
            </div>

            {/* מודאל ההצלחה שמחליף את ה-alert! */}
            {successModal.show && (
                <Modal
                    title="פעולה הושלמה"
                    titleColor="#10b981"
                    message="ההגדרות נשמרו בהצלחה! האתגר נוצר ואפשר להתקדם להוספת החידות."
                    confirmText="המשך לשלב הבא 🚀"
                    confirmType="success"
                    onConfirm={() => navigate(successModal.nextRoute)}
                />
            )}

        </div>
    );
};

// עיצובים חוזרים
const labelStyle = { display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151' };
const inputStyle = { width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box', backgroundColor: '#f9fafb' };

export default CreateRoom;








// import React, { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import { createRoom } from '../api/roomApi';

// const CreateRoom = () => {
//     const { user } = useContext(AuthContext);
//     const navigate = useNavigate();
//     const token = localStorage.getItem('token');

//     // 1. הסטייט עודכן - הופרדו התמונות ללובי ולמשחק
//     const [formData, setFormData] = useState({
//         title: '',
//         description: '',
//         timer_minutes: 15,
//         difficulty_level: 1,
//         min_points_required: 0,
//         cover_image_id: 1, // תמונת שער ללובי
//         bg_image_id: 1     // תמונת רקע למשחק עצמו
//     });

//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');

//         try {
//             const roomDataForServer = {
//                 title: formData.title,
//                 description: formData.description,
//                 timer_seconds: formData.timer_minutes * 60,
//                 difficulty_level: formData.difficulty_level,
//                 min_points_required: formData.min_points_required,
//                 cover_image_id: formData.cover_image_id, // נשלח בנפרד
//                 bg_image_id: formData.bg_image_id,       // נשלח בנפרד
//                 bg_audio_id: null
//             };

//             const data = await createRoom(roomDataForServer, token);

//             if (data.success) {
//                 // נניח שהשרת מחזיר לנו את ה-ID של החדר החדש שנוצר תחת data.roomId (או data.id)
//                 const newRoomId = data.roomId || data.id;

//                 if (newRoomId) {
//                     alert('ההגדרות נשמרו! עוברים להוספת החידות... 🚀');
//                     // 3. ניווט לעמוד יצירת החידות עם ה-ID של החדר
//                     navigate(`/manage-room/${newRoomId}`);
//                 } else {
//                     // מקרה גיבוי אם השרת לא החזיר ID
//                     alert('האתגר נוצר בהצלחה!');
//                     navigate('/developer');
//                 }
//             }
//         } catch (err) {
//             setError(err.response?.data?.message || 'שגיאה ביצירת האתגר. אנא נסה שוב.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '40px 20px', fontFamily: 'sans-serif', direction: 'rtl' }}>
//             <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>

//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e5e7eb', paddingBottom: '20px', marginBottom: '30px' }}>
//                     <h1 style={{ margin: 0, color: '#8b5cf6' }}>שלב 1: הגדרות החדר</h1>
//                     <button type="button" onClick={() => navigate('/developer')} style={{ background: 'none', border: '1px solid #d1d5db', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer' }}>
//                         ביטול וחזרה
//                     </button>
//                 </div>

//                 {error && <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '10px', borderRadius: '6px', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}

//                 <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

//                     {/* כותרת ותיאור */}
//                     <div>
//                         <label style={labelStyle}>שם האתגר (יופיע בלובי):</label>
//                         <input type="text" name="title" value={formData.title} onChange={handleChange} required style={inputStyle} placeholder="לדוגמה: הפריצה למעבדת הסייבר..." />
//                     </div>

//                     <div>
//                         <label style={labelStyle}>סיפור עלילתי (יופיע לשחקן בתחילת המשחק):</label>
//                         <textarea name="description" value={formData.description} onChange={handleChange} required style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} placeholder="מה סיפור המסגרת? מה מטרת השחקן?"></textarea>
//                     </div>

//                     <hr style={{ border: '1px solid #f3f4f6', margin: '10px 0' }} />

//                     {/* 2. הפרדת בחירת התמונות */}
//                     <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
//                         <div style={{ flex: 1, minWidth: '250px' }}>
//                             <label style={labelStyle}>תמונת שער (ללובי המשחקים):</label>
//                             <select name="cover_image_id" value={formData.cover_image_id} onChange={handleChange} style={inputStyle}>
//                                 <option value="1">💻 דלת פלדה נעולה</option>
//                                 <option value="2">🌲 שער ליער עבות</option>
//                                 <option value="3">🏰 מבצר עתיק מבחוץ</option>
//                                 <option value="4">🏢 בניין משרדים יוקרתי</option>
//                             </select>
//                             <small style={{ color: '#6b7280', marginTop: '4px', display: 'block' }}>תמונה זו תמשוך את השחקנים להיכנס.</small>
//                         </div>

//                         <div style={{ flex: 1, minWidth: '250px' }}>
//                             <label style={labelStyle}>תמונת רקע (בתוך המשחק עצמו):</label>
//                             <select name="bg_image_id" value={formData.bg_image_id} onChange={handleChange} style={inputStyle}>
//                                 <option value="1">💻 מעבדת האקרים מבפנים</option>
//                                 <option value="2">🌲 קרחת יער חשוכה</option>
//                                 <option value="3">🏰 אולם אבירים עם לפידים</option>
//                                 <option value="4">🏢 משרד מנכ"ל הפוך</option>
//                             </select>
//                             <small style={{ color: '#6b7280', marginTop: '4px', display: 'block' }}>הרקע שעליו יופיעו הטיימר והחידות.</small>
//                         </div>
//                     </div>

//                     <hr style={{ border: '1px solid #f3f4f6', margin: '10px 0' }} />

//                     {/* הגדרות טכניות */}
//                     <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
//                         <div style={{ flex: 1, minWidth: '150px' }}>
//                             <label style={labelStyle}>זמן לפתרון (בדקות):</label>
//                             <input type="number" name="timer_minutes" min="1" max="120" value={formData.timer_minutes} onChange={handleChange} required style={inputStyle} />
//                         </div>
//                         <div style={{ flex: 1, minWidth: '150px' }}>
//                             <label style={labelStyle}>רמת קושי (1-5):</label>
//                             <input type="number" name="difficulty_level" min="1" max="5" value={formData.difficulty_level} onChange={handleChange} required style={inputStyle} />
//                         </div>
//                         <div style={{ flex: 1, minWidth: '150px' }}>
//                             <label style={labelStyle}>נקודות דרושות לכניסה:</label>
//                             <input type="number" name="min_points_required" min="0" step="10" value={formData.min_points_required} onChange={handleChange} required style={inputStyle} />
//                         </div>
//                     </div>

//                     <button type="submit" disabled={loading} style={{ marginTop: '30px', padding: '16px', backgroundColor: '#8b5cf6', color: 'white', fontSize: '18px', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s' }}>
//                         {loading ? 'שומר חדר...' : 'המשך לשלב 2: הוספת חידות ➔'}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// // עיצובים חוזרים
// const labelStyle = { display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151' };
// const inputStyle = { width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box', backgroundColor: '#f9fafb' };

// export default CreateRoom;