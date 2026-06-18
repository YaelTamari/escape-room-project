import React, { useState, useEffect, useContext } from 'react'; // הוספתי את useContext
import { useParams, useNavigate } from 'react-router-dom';
import { enterRoom, submitPlayerAnswer, finishPlayerRoom, requestHint } from '../../api/gameApi';
import Navbar from '../../components/Navbar/Navbar';
import Modal from '../../components/Modal/Modal';
import { AuthContext } from '../../context/AuthContext'; // הוספתי בחזרה את הקונטקסט של הנקודות!
import styles from './PlayRoom.module.css';

const PlayRoom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const [gameData, setGameData] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answerInput, setAnswerInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [modalConfig, setModalConfig] = useState(null);
   //הפעלת השמע
    const [isMusicStarted, setIsMusicStarted] = useState(false);

    const [showIntro, setShowIntro] = useState(true);

    // מושכים את הפונקציה שמעדכנת נקודות בלייב
    const { updatePoints } = useContext(AuthContext);

    useEffect(() => {
        const startGame = async () => {
            try {
                const res = await enterRoom(roomId);
                if (res && res.success) {
                    
                    setGameData(res.gameData);
                } else {
                    showModal('שגיאה', 'שגיאה בטעינת החדר: ' + (res?.message || ''), 'danger');
                }
            } catch (err) {
                showModal('שגיאה', 'שגיאה בחיבור לשרת או שאין שאלות בחדר הזה.', 'danger');
            } finally {
                setLoading(false);
            }
        };
        startGame();
    }, [roomId]);

    const showModal = (title, message, type, onConfirm = null, onCancel = null, cancelText = null) => {
        setModalConfig({
            title, message, confirmType: type, cancelText,
            // showCancel: onCancel !== null && onCancel !== undefined && onCancel.toString() !== '() => {}',            onCancel: onCancel ? () => { setModalConfig(null); onCancel(); } : () => setModalConfig(null),
            showCancel: !!cancelText,
            onConfirm: () => { setModalConfig(null); if (onConfirm) onConfirm(); }
        });
    };

    const handleExitToLobby = () => {
        showModal('נסיגה למחנה 🏕️', 'בטוח שברצונך לצאת? ההתקדמות שלך נשמרה ביומן.', 'primary', () => navigate('/lobby'), () => {}, 'הישאר במשחק');
    };

    const handleGetHint = async () => {
        const currentQuestion = gameData.questions[currentQuestionIndex];
        try {
            const res = await requestHint(currentQuestion.id);
            if (res.success) showModal('לחישה מהאפלה 💡', res.hint_text, 'primary');
        } catch (err) {
            showModal('שגיאה', 'לא הצלחנו למשוך רמז כרגע.', 'danger');
        }
    };

    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        const currentQuestion = gameData.questions[currentQuestionIndex];

        try {
            const res = await submitPlayerAnswer(currentQuestion.id, answerInput);
           
            if (res.isCorrect) {
                setAnswerInput('');
               
                // ==== החזרנו את קסם הנקודות! ====
                if (res.pointsEarned) {
                    updatePoints(res.pointsEarned);
                }
                // =================================

                if (currentQuestionIndex + 1 < gameData.questions.length) {
                    showModal('נתיב חדש נפתח! 🗝️', res.message, 'success', () => {
                        setCurrentQuestionIndex(prev => prev + 1);
                    });

                } else {
                    // 1. מציגים קודם כל את הודעת ההצלחה של החידה האחרונה מהדאטה-בייס
                    showModal(
                        'החידה האחרונה פוצחה! 🗝️', 
                        res.message || 'הצלחתם לפתור את המשימה!', 
                        'success', 
                        () => {
                            // 2. ברגע שהמשתמש לוחץ "אישור" במודל הראשון, נפתח מיד מודל שני של סיום החדר
                            showModal(
                                '🏆 האתגר הושלם!', 
                                'כל הכבוד! סיימתם את החדר בהצלחה מרובה והצלתם את החבורה.', 
                                'success', 
                                async () => {
                                    // 3. רק ברגע שהוא לוחץ אישור על סיום החדר - מעדכנים את השרת ועוברים ללובי
                                    await finishPlayerRoom(roomId);
                                    navigate('/lobby');
                                }
                            );
                        }
                    );
                }

                // } else {
                //     await finishPlayerRoom(roomId);
                //     showModal('🏆 ניצחון!', 'שרדתם את האתגר ויצאתם לאור!', 'success', () => navigate('/lobby'));
                // }
            } else {
                showModal('הדרך חסומה ❌', res.message, 'danger');
            }
        } catch (err) {
            showModal('שגיאה', 'אפלה ירדה על השרת, נסה שוב.', 'danger');
        }
    };

    const handleElementClick = (element) => {
    // הדפסה זמנית לקונסול כדי שתוכלי לראות בדיוק אילו שדות מגיעים מהשרת!
        console.log("האלמנט שנלחץ:", element);

        if (element.element_type === 'scroll') {
            const scrollContent = (
                <div className={styles.scrollPopupContent}>
                    {element.element_text}
                </div>
            );
            showModal(element.button_label, scrollContent, 'scroll');
        } 
        else if (element.element_type === 'image') {
            // 1. חילוץ נתיב הקובץ מכל שדה אפשרי שהשרת עשוי להחזיר
            const rawPath = element.file_url || element.file_path || element.asset_url || element.path;
            
            // 2. בניית הכתובת המלאה ושימוש ב-encodeURI חובה עבור עברית ורווחים!
            const fullUrl = rawPath ? encodeURI(`http://localhost:5000${rawPath}`) : '';

            const imageHtml = (
                <div className={styles.imagePopupWrapper}>
                    {fullUrl ? (
                        <img 
                            src={fullUrl} 
                            alt={element.button_label || "element"} 
                            className={styles.popupImage}
                        />
                    ) : (
                        <p className={styles.popupError}>שגיאה: לא נמצא נתיב קובץ תקין באלמנט</p>                    )}
                </div>
            );
            showModal(element.button_label + ' 🗺️', imageHtml, 'primary');
        }
    };

    // const handleElementClick = (element) => {
    //     if (element.element_type === 'scroll') {
    //         const scrollContent = (
    //             <div style={{ fontFamily: "'Frank Ruhl Libre', serif", backgroundImage: 'url("http://localhost:5000/assets/popup/מגילה.jpg")', backgroundSize: '100% 100%', padding: '40px', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2c1e0f', fontSize: '24px' }}>
    //                 {element.element_text}
    //             </div>
    //         );
    //         showModal(element.button_label, scrollContent, 'scroll');
    //     } else if (element.element_type === 'image') {
    //         const imageHtml = <div style={{ textAlign: 'center' }}>
    //             <img 
    //                 src={`http://localhost:5000${element.file_url || element.file_path}`} 
    //                 alt={element.button_label || "element"} 
    //                 className={styles.popupImage} 
    //             />                </div>;
    //         showModal(element.button_label + ' 🗺️', imageHtml, 'primary');
    //     }
    // };

    if (loading) return <div className={styles.loading}>מדליק את הלפידים ופותח את שערי החדר... ⏳</div>;
    if (!gameData || !gameData.questions) return null;

   
    const currentQ = gameData.questions[currentQuestionIndex];
    
    // שימוש ב-encodeURI הופך רווחים ואותיות בעברית לנתיב שהדפדפן יודע לקרוא
    const bgUrl = gameData.room.bg_image_url 
    ? encodeURI(`http://localhost:5000${gameData.room.bg_image_url}`) 
    : '';
    // const bgUrl = gameData.room.bg_image_url ? `http://localhost:5000${gameData.room.bg_image_url}` : '';

    // תיקנתי את הכפילות פה! יש רק משתנה אחד כזה עכשיו.
    const audioUrl = gameData.room.bg_audio_url ? `http://localhost:5000${gameData.room.bg_audio_url}` : '';

    return (
        <div className={styles.pageContainer} style={{ backgroundImage: bgUrl ? `url("${bgUrl}")` : 'none' }}>
            <Navbar />
           
            {/* --- הקסם של המוזיקה קורה כאן! --- */}
            
            {isMusicStarted && audioUrl && (
                <audio src={audioUrl} autoPlay loop />
)}
            {/* {audioUrl && (
                <audio src={audioUrl} autoPlay loop />
            )} */}
           
            {showIntro ? (
                <div className={styles.introScreen}>
                    <div className={styles.introBox}>
                        <h1 className={styles.introTitle}>{gameData.room.title}</h1>
                        <p className={styles.introDesc}>
                            {gameData.room.description || "האם תצליחו לפתור את התעלומה ולצאת בזמן?"}
                        </p>
                        <button onClick={() => {
                            setIsMusicStarted(true);
                            setShowIntro(false); }} className={styles.startBtn}>
                            היכנס אל הלא נודע 🗝️
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className={styles.exitButtonWrapper}>
                        <button onClick={handleExitToLobby} className={styles.exitButton}>
                            השהה וחזור לעמוד האתגרים
                        </button>
                    </div>

                    <div className={styles.gameLayout}>
                        {/* העזרים כעיגולים צפים בצד */}
                        <div className={styles.sidebarFloating}>
                            {gameData.elements && gameData.elements.map(el => (
                                <div key={el.id} onClick={() => handleElementClick(el)} className={styles.elementCircle}>
                                    <span>{el.element_type === 'scroll' ? '📜' : '🗺️'}</span>
                                    {el.button_label}
                                </div>
                            ))}
                        </div>

                        {/* החידה המרכזית */}
                        <div key={currentQuestionIndex} className={styles.mainCard}>
                            <h1 className={styles.roomTitle}>{gameData.room.title}</h1>
                            <div className={styles.stepIndicator}>
                                ✦ שלב {currentQuestionIndex + 1} מתוך {gameData.questions.length} ✦
                            </div>
                           
                            {/* רסיס העלילה עם הטקסט המעודכן */}
                            {currentQ.story_text && (
                                <div className={styles.loreBox}>
                                    <h3 className={styles.loreTitle}> הצעד הבא לפתרון האתגר</h3>
                                    <p className={styles.storyText}>{currentQ.story_text}</p>
                                </div>
                            )}

                            <h2 className={styles.questionText}>{currentQ.question_text}</h2>

                            <form onSubmit={handleAnswerSubmit} className={styles.form}>
                                <input
                                    type="text"
                                    value={answerInput}
                                    onChange={(e) => setAnswerInput(e.target.value)}
                                    placeholder="הקש את הפתרון שלך כאן..."
                                    required
                                    className={styles.inputField}
                                />
                               
                                <div className={styles.actionButtonsRow}>
                                    <button type="submit" className={styles.submitButton}>
                                        בדוק תשובה
                                    </button>
                                    <button type="button" onClick={handleGetHint} className={styles.hintButton}>
                                        רמז
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}

            {modalConfig && (
                <Modal
                    title={modalConfig.title} message={modalConfig.message}
                    onConfirm={modalConfig.onConfirm} confirmType={modalConfig.confirmType}
                    onCancel={modalConfig.onCancel} cancelText={modalConfig.cancelText}
                    showCancel={modalConfig.showCancel}
                />
            )}
        </div>
    );
};

export default PlayRoom;