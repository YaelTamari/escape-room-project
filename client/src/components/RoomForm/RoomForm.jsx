
import React, { useState, useEffect } from 'react'; // הוספנו useState ו-useEffect
import { useNavigate } from 'react-router-dom';
import { getAssets } from '../../api/assetApi'; // ייבוא הפונקציה שלך שמביאה מהדאטה-בייס!
import styles from './RoomForm.module.css';

const RoomForm = ({ formData, handleChange, handleSubmit, loading, isEdit }) => {
    const navigate = useNavigate();

    // כאן נשמור את התמונות והשמע שיגיעו מהדאטה-בייס
    const [images, setImages] = useState([]);
    const [audios, setAudios] = useState([]);

    // ברגע שהטופס עולה למסך, אנחנו רצים להביא את הנתונים!
    useEffect(() => {
        const fetchDynamicAssets = async () => {
            try {
                // מביאים את כל התמונות (type='image')
                const imgRes = await getAssets('image', 1, 100);
                // תלוי איך השרת שלך עוטף את התשובה, בדרך כלל זה בתוך assets או data
                //const imageList = imgRes.assets || imgRes.data || []; 
                const imageList = imgRes.assets || imgRes.data?.assets || (Array.isArray(imgRes.data) ? imgRes.data : []);
                setImages(imageList);

                // מביאים את כל קבצי האודיו (type='audio')
                const audRes = await getAssets('audio', 1, 100);
                //const audioList = audRes.assets || audRes.data || [];
                
                const audioList = audRes.assets || audRes.data?.assets || (Array.isArray(audRes.data) ? audRes.data : []);
                setAudios(audioList);
            } catch (error) {
                console.error("שגיאה במשיכת הנכסים מהדאטה-בייס:", error);
            }
        };
        
        fetchDynamicAssets();
    }, []);

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

                {/* ===== כאן הקסם של ה-MySQL קורה! ===== */}
                <div className={styles.flexRow}>
                    
                    {/* 1. רשימת התמונות האמיתית מהשרת */}
                    <div className={styles.flexChild}>
                        <label className={styles.label}>תמונת רקע (ללובי ולמשחק עצמו):</label>
                        <select 
                            name="bg_image_id" 
                            value={formData.bg_image_id || ''} 
                            onChange={handleChange} 
                            required
                            className={styles.input}
                        >
                            <option value="">-- בחר תמונת רקע -- 🖼️</option>
                            {images.map(img => (
                                <option key={img.id} value={img.id}>
                                    {img.title || img.name || `תמונה מספר ${img.id}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 2. רשימת השמע האמיתית מהשרת */}
                    <div className={styles.flexChild}>
                        <label className={styles.label}>מוזיקת רקע למשחק:</label>
                        <select 
                            name="bg_audio_id" 
                            value={formData.bg_audio_id || ''} 
                            onChange={handleChange} 
                            className={styles.input}
                        >
                            <option value="">-- ללא מנגינה -- 🔇</option>
                            {audios.map(aud => (
                                <option key={aud.id} value={aud.id}>
                                    {aud.title || aud.name || `שמע מספר ${aud.id}`} 🎵
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                {/* ======================================= */}

                <hr className={styles.divider} />

                <div className={styles.flexRow}>
                    <div className={styles.flexChildSmall}>
                        <label className={styles.label}>זמן לפתרון (בדקות):</label>
                        <input type="number" name="timer_minutes" min="1" max="120" value={formData.timer_minutes} onChange={handleChange} required className={styles.input} />
                    </div>
                    <div className={styles.flexChildSmall}>
                        <label className={styles.label}>רמת קושי (1-5):</label>
                        <input type="number" name="difficulty_level" min="1" max="5" value={formData.difficulty_level} onChange={handleChange} required className={styles.input} />
                    </div>
                    <div className={styles.flexChildSmall}>
                        <label className={styles.label}>נקודות דרושות לכניסה:</label>
                        <input type="number" name="min_points_required" min="0" step="10" value={formData.min_points_required} onChange={handleChange} required className={styles.input} />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading} 
                    className={styles.submitButton}
                    style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                    {loading ? 'שומר חדר...' : (isEdit ? ' שמור שינויים' : 'המשך לשלב 2: הוספת חידות ➔')}
                </button>
            </form>
        </div>
    );
};

export default RoomForm;

