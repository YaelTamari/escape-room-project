import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RoomForm.module.css'; // ייבוא ה-CSS המופרד

const RoomForm = ({ formData, handleChange, handleSubmit, loading, isEdit }) => {
    const navigate = useNavigate();

    return (
        <div className={styles.formContainer}>
            <div className={styles.headerContainer}>
                <h1 className={styles.title}>
                    {isEdit ? '✏️ עריכת הגדרות חדר' : '✨ שלב 1: הגדרות החדר'}
                </h1>
                <button 
                    type="button" 
                    onClick={() => navigate('/developer')} 
                    className={styles.cancelButton}
                >
                    ביטול וחזרה
                </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.formElement}>
                <div>
                    <label className={styles.label}>שם האתגר (יופיע בלובי):</label>
                    <input 
                        type="text" 
                        name="title" 
                        value={formData.title} 
                        onChange={handleChange} 
                        required 
                        className={styles.input} 
                        placeholder="לדוגמה: הפריצה למעבדת הסייבר..." 
                    />
                </div>

                <div>
                    <label className={styles.label}>סיפור עלילתי (יופיע לשחקן בתחילת המשחק):</label>
                    <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        required 
                        className={`${styles.input} ${styles.textarea}`} 
                        placeholder="מה סיפור המסגרת? מה מטרת השחקן?"
                    ></textarea>
                </div>

                <hr className={styles.divider} />

                <div className={styles.flexRow}>
                    <div className={styles.flexChild}>
                        <label className={styles.label}>תמונת שער (ללובי המשחקים):</label>
                        <select 
                            name="cover_image_id" 
                            value={formData.cover_image_id} 
                            onChange={handleChange} 
                            className={styles.input}
                        >
                            <option value="1">💻 דלת פלדה נעולה</option>
                            <option value="2">🌲 שער ליער עבות</option>
                            <option value="3">🏰 מבצר עתיק מבחוץ</option>
                            <option value="4">🏢 בניין משרדים יוקרתי</option>
                        </select>
                    </div>

                    <div className={styles.flexChild}>
                        <label className={styles.label}>תמונת רקע (בתוך המשחק עצמו):</label>
                        <select 
                            name="bg_image_id" 
                            value={formData.bg_image_id} 
                            onChange={handleChange} 
                            className={styles.input}
                        >
                            <option value="1">💻 מעבדת האקרים מבפנים</option>
                            <option value="2">🌲 קרחת יער חשוכה</option>
                            <option value="3">🏰 אולם אבירים עם לפידים</option>
                            <option value="4">🏢 משרד מנכ"ל הפוך</option>
                        </select>
                    </div>
                </div>

                <hr className={styles.divider} />

                <div className={styles.flexRow}>
                    <div className={styles.flexChildSmall}>
                        <label className={styles.label}>זמן לפתרון (בדקות):</label>
                        <input 
                            type="number" 
                            name="timer_minutes" 
                            min="1" 
                            max="120" 
                            value={formData.timer_minutes} 
                            onChange={handleChange} 
                            required 
                            className={styles.input} 
                        />
                    </div>
                    <div className={styles.flexChildSmall}>
                        <label className={styles.label}>רמת קושי (1-5):</label>
                        <input 
                            type="number" 
                            name="difficulty_level" 
                            min="1" 
                            max="5" 
                            value={formData.difficulty_level} 
                            onChange={handleChange} 
                            required 
                            className={styles.input} 
                        />
                    </div>
                    <div className={styles.flexChildSmall}>
                        <label className={styles.label}>נקודות דרושות לכניסה:</label>
                        <input 
                            type="number" 
                            name="min_points_required" 
                            min="0" 
                            step="10" 
                            value={formData.min_points_required} 
                            onChange={handleChange} 
                            required 
                            className={styles.input} 
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading} 
                    className={styles.submitButton}
                    style={{ cursor: loading ? 'not-allowed' : 'pointer' }} // השארת הדינמיות הקטנה הזו בקוד לטובת נוחות
                >
                    {loading ? 'שומר חדר...' : (isEdit ? '💾 שמור שינויים' : 'המשך לשלב 2: הוספת חידות ➔')}
                </button>
            </form>
        </div>
    );
};

export default RoomForm;








// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const RoomForm = ({ formData, handleChange, handleSubmit, loading, isEdit }) => {
//     const navigate = useNavigate();

//     return (
//         <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e5e7eb', paddingBottom: '20px', marginBottom: '30px' }}>
//                 <h1 style={{ margin: 0, color: '#8b5cf6' }}>
//                     {isEdit ? '✏️ עריכת הגדרות חדר' : '✨ שלב 1: הגדרות החדר'}
//                 </h1>
//                 <button type="button" onClick={() => navigate('/developer')} style={{ background: 'none', border: '1px solid #d1d5db', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer' }}>
//                     ביטול וחזרה
//                 </button>
//             </div>

//             <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
//                 <div>
//                     <label style={labelStyle}>שם האתגר (יופיע בלובי):</label>
//                     <input type="text" name="title" value={formData.title} onChange={handleChange} required style={inputStyle} placeholder="לדוגמה: הפריצה למעבדת הסייבר..." />
//                 </div>

//                 <div>
//                     <label style={labelStyle}>סיפור עלילתי (יופיע לשחקן בתחילת המשחק):</label>
//                     <textarea name="description" value={formData.description} onChange={handleChange} required style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }} placeholder="מה סיפור המסגרת? מה מטרת השחקן?"></textarea>
//                 </div>

//                 <hr style={{ border: '1px solid #f3f4f6', margin: '10px 0' }} />

//                 <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
//                     <div style={{ flex: 1, minWidth: '250px' }}>
//                         <label style={labelStyle}>תמונת שער (ללובי המשחקים):</label>
//                         <select name="cover_image_id" value={formData.cover_image_id} onChange={handleChange} style={inputStyle}>
//                             <option value="1">💻 דלת פלדה נעולה</option>
//                             <option value="2">🌲 שער ליער עבות</option>
//                             <option value="3">🏰 מבצר עתיק מבחוץ</option>
//                             <option value="4">🏢 בניין משרדים יוקרתי</option>
//                         </select>
//                     </div>

//                     <div style={{ flex: 1, minWidth: '250px' }}>
//                         <label style={labelStyle}>תמונת רקע (בתוך המשחק עצמו):</label>
//                         <select name="bg_image_id" value={formData.bg_image_id} onChange={handleChange} style={inputStyle}>
//                             <option value="1">💻 מעבדת האקרים מבפנים</option>
//                             <option value="2">🌲 קרחת יער חשוכה</option>
//                             <option value="3">🏰 אולם אבירים עם לפידים</option>
//                             <option value="4">🏢 משרד מנכ"ל הפוך</option>
//                         </select>
//                     </div>
//                 </div>

//                 <hr style={{ border: '1px solid #f3f4f6', margin: '10px 0' }} />

//                 <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
//                     <div style={{ flex: 1, minWidth: '150px' }}>
//                         <label style={labelStyle}>זמן לפתרון (בדקות):</label>
//                         <input type="number" name="timer_minutes" min="1" max="120" value={formData.timer_minutes} onChange={handleChange} required style={inputStyle} />
//                     </div>
//                     <div style={{ flex: 1, minWidth: '150px' }}>
//                         <label style={labelStyle}>רמת קושי (1-5):</label>
//                         <input type="number" name="difficulty_level" min="1" max="5" value={formData.difficulty_level} onChange={handleChange} required style={inputStyle} />
//                     </div>
//                     <div style={{ flex: 1, minWidth: '150px' }}>
//                         <label style={labelStyle}>נקודות דרושות לכניסה:</label>
//                         <input type="number" name="min_points_required" min="0" step="10" value={formData.min_points_required} onChange={handleChange} required style={inputStyle} />
//                     </div>
//                 </div>

//                 <button type="submit" disabled={loading} style={{ marginTop: '30px', padding: '16px', backgroundColor: '#8b5cf6', color: 'white', fontSize: '18px', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s' }}>
//                     {loading ? 'שומר חדר...' : (isEdit ? '💾 שמור שינויים' : 'המשך לשלב 2: הוספת חידות ➔')}
//                 </button>
//             </form>
//         </div>
//     );
// };

// const labelStyle = { display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151' };
// const inputStyle = { width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box', backgroundColor: '#f9fafb' };

// export default RoomForm;
