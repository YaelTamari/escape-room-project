
import React, { useState, useEffect } from 'react'; // הוספנו useState ו-useEffect
import { useNavigate } from 'react-router-dom';
import { getAssets } from '../../api/assetApi'; // ייבוא הפונקציה שלך שמביאה מהדאטה-בייס!
import styles from './RoomForm.module.css';


const RoomForm = ({ formData, handleChange, handleSubmit, loading, isEdit }) => {
    const navigate = useNavigate();

    const [images, setImages] = useState([]);
    const [imagePage, setImagePage] = useState(1);
    const [hasMoreImages, setHasMoreImages] = useState(false);

    const [audios, setAudios] = useState([]);
    const [audioPage, setAudioPage] = useState(1);
    const [hasMoreAudios, setHasMoreAudios] = useState(false);


    // משיכת תמונות - תרוץ בטעינה הראשונה ובכל פעם שהעמוד משתנה
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const imgRes = await getAssets('image', imagePage, 5);
                const imageList = imgRes.assets || imgRes.data?.assets || (Array.isArray(imgRes.data) ? imgRes.data : []);

                setImages(prev => {
                    // אם אנחנו בעמוד הראשון, נדרוס את הרשימה (פותר את כפילות ה-Strict Mode)
                    const combined = imagePage === 1 ? imageList : [...prev, ...imageList];
                    // סינון כפילויות ודאי לפי ID (כדי שאף פעם לא תהיה שגיאת Key)
                    const uniqueImages = Array.from(new Map(combined.map(item => [item.id, item])).values());
                    return uniqueImages;
                });

                setHasMoreImages(imgRes.hasMore);
            } catch (error) {
                console.error("שגיאה בתמונות:", error);
            }
        };
        fetchImages();
    }, [imagePage]);

    useEffect(() => {
        const fetchAudios = async () => {
            try {
                const audRes = await getAssets('audio', audioPage, 5);
                const audioList = audRes.assets || audRes.data?.assets || (Array.isArray(audRes.data) ? audRes.data : []);

                setAudios(prev => {
                    const combined = audioPage === 1 ? audioList : [...prev, ...audioList];
                    const uniqueAudios = Array.from(new Map(combined.map(item => [item.id, item])).values());
                    return uniqueAudios;
                });

                setHasMoreAudios(audRes.hasMore);
            } catch (error) {
                console.error("שגיאה בשמע:", error);
            }
        };
        fetchAudios();
    }, [audioPage]);


    return (
        <div className={styles.formContainer}>
            <div className={styles.headerContainer}>
                <h1 className={styles.title}>
                    {isEdit ? ' עריכת הגדרות חדר' : 'הגדרות החדר'}
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

                    {/* 1. בחירת תמונת רקע */}
                    <div className={styles.flexChild}>
                        <label className={styles.label}>תמונת רקע (ללובי ולמשחק עצמו):</label>
                        <div className={styles.selectWithButton}>
                            <select
                                name="bg_image_id"
                                value={formData.bg_image_id || ''}
                                onChange={handleChange}
                                required
                                className={styles.input}
                            >
                                <option value="">-- בחר תמונת רקע -- </option>
                                {images.map(img => (
                                    <option key={img.id} value={img.id}>
                                        {img.title || img.name || `תמונה מספר ${img.id}`}
                                    </option>
                                ))}
                            </select>
                            {hasMoreImages && (
                                <button
                                    type="button"
                                    onClick={() => setImagePage(prev => prev + 1)}
                                    className={styles.loadMoreSelectBtn}
                                    title="טען תמונות נוספות"
                                >
                                    +
                                </button>
                            )}
                        </div>
                    </div>

                    {/*  בחירת מוזיקת רקע */}
                    <div className={styles.flexChild}>
                        <label className={styles.label}>מוזיקת רקע למשחק:</label>
                        <div className={styles.selectWithButton}>
                            <select
                                name="bg_audio_id"
                                value={formData.bg_audio_id || ''}
                                onChange={handleChange}
                                className={styles.input}
                            >
                                <option value="">-- ללא מנגינה -- </option>
                                {audios.map(aud => (
                                    <option key={aud.id} value={aud.id}>
                                        {aud.title || aud.name || `שמע מספר ${aud.id}`}
                                    </option>
                                ))}
                            </select>
                            {hasMoreAudios && (
                                <button
                                    type="button"
                                    onClick={() => setAudioPage(prev => prev + 1)}
                                    className={styles.loadMoreSelectBtn}
                                    title="טען קטעי שמע נוספים"
                                >
                                    +
                                </button>
                            )}
                        </div>
                    </div>
                </div>

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
                    className={`${styles.submitButton} ${loading ? styles.loadingBtn : ''}`}
                >
                    {loading ? 'שומר חדר...' : (isEdit ? ' שמור שינויים' : 'המשך לשלב 2: הוספת חידות ➔')}
                </button>
            </form>
        </div>
    );
};

export default RoomForm;