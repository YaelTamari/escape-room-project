import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { enterRoom, submitPlayerAnswer, finishPlayerRoom, requestHint } from '../api/gameApi';
import Navbar from '../components/Navbar/Navbar';
import Modal from '../components/Modal/Modal'; // הייבוא של הפופאפ של יעל

const scrollStyle = {
    fontFamily: "'AntiqueFont', cursive", 
    backgroundColor: '#f4e4bc',
    padding: '40px',
    textAlign: 'center',
    borderRadius: '10px',
    border: '5px solid #8b4513'
};


const PlayRoom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const [gameData, setGameData] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answerInput, setAnswerInput] = useState('');
    const [loading, setLoading] = useState(true);

    // ניהול חכם של הפופאפים (Modal) - אובייקט אחד שולט בהכל!
    const [modalConfig, setModalConfig] = useState(null);

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

    // פונקציית עזר קטנה להקפצת הפופאפ
    const showModal = (title, message, type, onConfirm = null, onCancel = null, cancelText = null) => {
        setModalConfig({
            title,
            message,
            confirmType: type,
            cancelText: cancelText,
            onCancel: onCancel ? () => {
                setModalConfig(null);
                onCancel();
            } : () => setModalConfig(null),
            onConfirm: () => {
                setModalConfig(null); // סוגר את הפופאפ
                if (onConfirm) onConfirm(); // מפעיל פעולת המשך אם יש
            }
        });
    };

    // טיפול ביציאה ללובי
    const handleExitToLobby = () => {
        showModal(
            'השהיית משחק ⏸️',
            'בטוח שברצונך לצאת ללובי? ההתקדמות שלך (תשובות ורמזים) נשמרה באופן אוטומטי.',
            'primary', // confirmType - צבע כפתור אישור
            () => navigate('/lobby'), // onConfirm - הפעולה אם המשתמש מאשר
            () => {}, // onCancel - הפעולה אם המשתמש מבטל (רק סוגר את המודאל)
            'הישאר במשחק' // cancelText - טקסט לכפתור ביטול
        );
    };

    // בקשת רמז
    const handleGetHint = async () => {
        const currentQuestion = gameData.questions[currentQuestionIndex];
        try {
            const res = await requestHint(currentQuestion.id);
            if (res.success) {
                // מציג את הרמז בפופאפ
                showModal('רמז 💡', res.hint_text, 'primary');
            }
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
                setAnswerInput(''); // ניקוי השדה
                
                // בודקים אם יש עוד שאלות בחדר
                if (currentQuestionIndex + 1 < gameData.questions.length) {
                    showModal('כל הכבוד! 🎉', res.message, 'success', () => {
                        setCurrentQuestionIndex(prev => prev + 1); // עוברים לשאלה הבאה רק אחרי שאישרו את הפופאפ
                    });
                } else {
                    // סיום משחק
                    await finishPlayerRoom(roomId);
                    showModal('🏆 אלופים!', 'סיימתם את החדר בהצלחה!', 'success', () => {
                        navigate('/lobby');
                    });
                }
            } else {
                showModal('אופס... ❌', res.message, 'danger');
            }
        } catch (err) {
            showModal('שגיאה', 'שגיאה בבדיקת התשובה.', 'danger');
        }
    };


    const handleElementClick = (element) => {
    // השארתי את ה-console.log כדי שתוכלי לוודא שאת רואה את השדות הנכונים
    console.log("מה יש בתוך האלמנט שנלחץ?", element);

    if (element.element_type === 'scroll') {
        // עיצוב למגילה (עם הפונט שהגדרנו)
        const scrollContent = (
            <div style={{ 
                // הקוד של הפונט נשאר כמו שהוא, זה מצוין
                fontFamily: "'AntiqueFont', cursive", 

                // הכתובת הזו חייבת להתאים בדיוק למה שהגדרנו בשרת
                backgroundImage: 'url("http://localhost:5000/assets/popup/מגילה.jpg")', 
                
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                
                // חשוב: תוודאי שאין הגדרה אחרת של backgroundColor שחוסמת את התמונה
                backgroundColor: 'transparent', 
                
                padding: '40px',
                minHeight: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2c1e0f',
                fontSize: '22px'
            }}>
                {element.element_text} 
            </div>
        );
        showModal(element.button_label, scrollContent, 'primary');

    } else if (element.element_type === 'image') {
        // תמונה
        const imageHtml = (
            <div style={{ textAlign: 'center' }}>
                <img 
                    src={element.asset_url}  /* תיקון: השם הוא asset_url */
                    alt={element.button_label} 
                    style={{ maxWidth: '100%', borderRadius: '8px', border: '2px solid #d1d5db' }} 
                />
            </div>
        );
        showModal(element.button_label + ' 🗺️', imageHtml, 'primary');
    }
};




    // const handleElementClick = (element) => {
    //     console.log("מה יש בתוך האלמנט שנלחץ?", element);
    //     if (element.element_type === 'scroll') {
    //         // אם זו מגילה, נציג את הטקסט בפופאפ
    //         showModal(element.button_label + ' 📜', element.element_text, 'primary');
    //     } else if (element.element_type === 'image') {
    //         // אם זו תמונה, נציג את התמונה בתוך הפופאפ!
    //         const imageHtml = (
    //             <div style={{ textAlign: 'center' }}>
    //                 <img src={element.file_url} alt={element.button_label} style={{ maxWidth: '100%', borderRadius: '8px', border: '2px solid #d1d5db' }} />
    //             </div>
    //         );
    //         showModal(element.button_label + ' 🗺️', imageHtml, 'primary');
    //     }
    // };


    if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '24px' }}>טוען את החדר ומכין את החידות... ⏳</div>;
    if (!gameData || !gameData.questions) return null;

    const currentQ = gameData.questions[currentQuestionIndex];
    const bgUrl = gameData.room.bg_image_url ? `http://localhost:5000${gameData.room.bg_image_url}` : '';

   return (
        <div style={{ 
            minHeight: '100vh', direction: 'rtl', display: 'flex', flexDirection: 'column',
            backgroundImage: bgUrl ? `url(${bgUrl})` : 'none', 
            backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', backgroundColor: '#1f2937' 
        }}>
            <Navbar />
            
            {/* כפתור היציאה */}
            <div style={{ position: 'absolute', top: '80px', left: '20px', zIndex: 10 }}>
                <button 
                    onClick={handleExitToLobby}
                    style={{ padding: '10px 15px', backgroundColor: 'rgba(0, 0, 0, 0.6)', color: 'white', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', transition: '0.2s' }}
                    onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.9)'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'}
                >
                    השהה ויצא ללובי ⏸️
                </button>
            </div>

            {/* מעטפת גמישה שמחלקת את המסך לאזור המשחק ולאזור העזרים */}
            <div style={{ display: 'flex', flex: 1, padding: '20px', gap: '20px', maxWidth: '1200px', margin: '60px auto 0 auto', width: '100%', alignItems: 'flex-start' }}>
                
                {/* === העמודה הצדדית (תרמיל העזרים / Sidebar) === */}
                <div style={{ flex: '0 0 280px', backgroundColor: 'rgba(31, 41, 55, 0.85)', padding: '20px', borderRadius: '12px', border: '1px solid #4b5563', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', color: '#f3f4f6' }}>
                    <h3 style={{ margin: '0 0 15px 0', borderBottom: '2px solid #6b7280', paddingBottom: '10px', textAlign: 'center' }}>תרמיל כלים 🎒</h3>
                    
                    {(!gameData.elements || gameData.elements.length === 0) ? (
                        <p style={{ textAlign: 'center', fontSize: '14px', color: '#9ca3af', fontStyle: 'italic' }}>אין עזרים מיוחדים בחדר זה.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {gameData.elements.map(el => {
                                // אם זה שעון חול, מציגים אנימציה/טקסט יפה (בהמשך נכניס כאן ממש אנימציית Lottie)
                                if (el.element_type === 'hourglass') {
                                    return (
                                        <div key={el.id} style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '15px', borderRadius: '8px', textAlign: 'center', border: '1px solid #fbbf24' }}>
                                            <div style={{ fontSize: '24px', marginBottom: '5px' }}>⏳</div>
                                            <strong style={{ color: '#fbbf24' }}>{el.button_label || 'שעון חול'}</strong>
                                        </div>
                                    );
                                }
                                // אם זה מגילה או תמונה, זה כפתור לחיץ
                                return (
                                    <button 
                                        key={el.id} 
                                        onClick={() => handleElementClick(el)}
                                        style={{ padding: '12px', backgroundColor: '#374151', color: '#f3f4f6', border: '1px solid #6b7280', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', transition: '0.2s' }}
                                        onMouseOver={(e) => e.target.style.backgroundColor = '#4b5563'}
                                        onMouseOut={(e) => e.target.style.backgroundColor = '#374151'}
                                    >
                                        <span>{el.element_type === 'scroll' ? '📜' : '🗺️'}</span>
                                        {el.button_label}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* === העמודה המרכזית (החידה עצמה) === */}
                <div style={{ flex: '1', backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '30px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                    <h1 style={{ color: '#8b5cf6', textAlign: 'center', margin: '0 0 10px 0' }}>{gameData.room.title}</h1>
                    <div style={{ textAlign: 'center', marginBottom: '20px', color: '#4b5563', fontWeight: 'bold', fontSize: '18px' }}>
                        שלב {currentQuestionIndex + 1} מתוך {gameData.questions.length}
                    </div>

                    <hr style={{ borderColor: '#e5e7eb', marginBottom: '20px' }} />

                    <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #d1d5db' }}>
                        {currentQ.story_text && (
                            <p style={{ color: '#374151', marginBottom: '15px', fontStyle: 'italic', fontSize: '16px', lineHeight: '1.5' }}>
                                {currentQ.story_text}
                            </p>
                        )}
                        <h2 style={{ margin: '0', color: '#111827' }}>{currentQ.question_text}</h2>
                    </div>

                    <form onSubmit={handleAnswerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input 
                            type="text" 
                            value={answerInput} 
                            onChange={(e) => setAnswerInput(e.target.value)} 
                            placeholder="הזן את התשובה שלך כאן..." 
                            required 
                            style={{ padding: '15px', borderRadius: '8px', border: '2px solid #d1d5db', fontSize: '18px' }}
                        />
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" style={{ flex: 1, padding: '15px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}>
                                בדוק תשובה 🔍
                            </button>
                            <button type="button" onClick={handleGetHint} style={{ padding: '15px 25px', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}>
                                רמז 💡
                            </button>
                        </div>
                    </form>
                </div>

            </div>

            {modalConfig && (
                <Modal 
                    title={modalConfig.title} 
                    message={modalConfig.message} 
                    onConfirm={modalConfig.onConfirm} 
                    confirmType={modalConfig.confirmType}
                    onCancel={modalConfig.onCancel}
                    cancelText={modalConfig.cancelText}
                />
            )}
        </div>
    );
};

export default PlayRoom;










// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { enterRoom, submitPlayerAnswer, finishPlayerRoom, requestHint } from '../api/gameApi';
// import Navbar from '../components/Navbar/Navbar';
// import Modal from '../components/Modal/Modal'; // הייבוא של הפופאפ של יעל

// const PlayRoom = () => {
//     const { roomId } = useParams();
//     const navigate = useNavigate();

//     const [gameData, setGameData] = useState(null);
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//     const [answerInput, setAnswerInput] = useState('');
//     const [loading, setLoading] = useState(true);

//     // ניהול חכם של הפופאפים (Modal) - אובייקט אחד שולט בהכל!
//     const [modalConfig, setModalConfig] = useState(null);

//     useEffect(() => {
//         const startGame = async () => {
//             try {
//                 const res = await enterRoom(roomId);
//                 if (res && res.success) {
//                     setGameData(res.gameData);
//                 } else {
//                     showModal('שגיאה', 'שגיאה בטעינת החדר: ' + (res?.message || ''), 'danger');
//                 }
//             } catch (err) {
//                 showModal('שגיאה', 'שגיאה בחיבור לשרת או שאין שאלות בחדר הזה.', 'danger');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         startGame();
//     }, [roomId]);

//     // פונקציית עזר קטנה להקפצת הפופאפ
//     const showModal = (title, message, type, onConfirm = null) => {
//         setModalConfig({
//             title,
//             message,
//             confirmType: type,
//             onConfirm: () => {
//                 setModalConfig(null); // סוגר את הפופאפ
//                 if (onConfirm) onConfirm(); // מפעיל פעולת המשך אם יש
//             }
//         });
//     };

//     // בקשת רמז
//     const handleGetHint = async () => {
//         const currentQuestion = gameData.questions[currentQuestionIndex];
//         try {
//             const res = await requestHint(currentQuestion.id);
//             if (res.success) {
//                 // מציג את הרמז בפופאפ
//                 showModal('רמז 💡', res.hint_text, 'primary');
//             }
//         } catch (err) {
//             showModal('שגיאה', 'לא הצלחנו למשוך רמז כרגע.', 'danger');
//         }
//     };

//     const handleAnswerSubmit = async (e) => {
//         e.preventDefault();
//         const currentQuestion = gameData.questions[currentQuestionIndex];

//         try {
//             const res = await submitPlayerAnswer(currentQuestion.id, answerInput);
            
//             if (res.isCorrect) {
//                 setAnswerInput(''); // ניקוי השדה
                
//                 // בודקים אם יש עוד שאלות בחדר
//                 if (currentQuestionIndex + 1 < gameData.questions.length) {
//                     showModal('כל הכבוד! 🎉', res.message, 'success', () => {
//                         setCurrentQuestionIndex(prev => prev + 1); // עוברים לשאלה הבאה רק אחרי שאישרו את הפופאפ
//                     });
//                 } else {
//                     // סיום משחק
//                     await finishPlayerRoom(roomId);
//                     showModal('🏆 אלופים!', 'סיימתם את החדר בהצלחה!', 'success', () => {
//                         navigate('/lobby');
//                     });
//                 }
//             } else {
//                 showModal('אופס... ❌', res.message, 'danger');
//             }
//         } catch (err) {
//             showModal('שגיאה', 'שגיאה בבדיקת התשובה.', 'danger');
//         }
//     };

//     if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '24px' }}>טוען את החדר ומכין את החידות... ⏳</div>;
//     if (!gameData || !gameData.questions) return null;

//     const currentQ = gameData.questions[currentQuestionIndex];
//     const bgUrl = gameData.room.bg_image_url ? `http://localhost:5000${gameData.room.bg_image_url}` : '';

//     return (
//         <div style={{ 
//             minHeight: '100vh', direction: 'rtl', 
//             backgroundImage: bgUrl ? `url(${bgUrl})` : 'none', 
//             backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#1f2937' 
//         }}>
//             <Navbar />
            
//             <div style={{ maxWidth: '650px', margin: '40px auto', backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '30px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                
//                 <h1 style={{ color: '#8b5cf6', textAlign: 'center', margin: '0 0 10px 0' }}>{gameData.room.title}</h1>
//                 <div style={{ textAlign: 'center', marginBottom: '20px', color: '#4b5563', fontWeight: 'bold', fontSize: '18px' }}>
//                     שלב {currentQuestionIndex + 1} מתוך {gameData.questions.length}
//                 </div>

//                 <hr style={{ borderColor: '#e5e7eb', marginBottom: '20px' }} />

//                 <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #d1d5db' }}>
//                     {currentQ.story_text && (
//                         <p style={{ color: '#374151', marginBottom: '15px', fontStyle: 'italic', fontSize: '16px', lineHeight: '1.5' }}>
//                             {currentQ.story_text}
//                         </p>
//                     )}
//                     <h2 style={{ margin: '0', color: '#111827' }}>{currentQ.question_text}</h2>
//                 </div>

//                 <form onSubmit={handleAnswerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
//                     <input 
//                         type="text" 
//                         value={answerInput} 
//                         onChange={(e) => setAnswerInput(e.target.value)} 
//                         placeholder="הזן את התשובה שלך כאן..." 
//                         required 
//                         style={{ padding: '15px', borderRadius: '8px', border: '2px solid #d1d5db', fontSize: '18px' }}
//                     />
                    
//                     {/* שורת הכפתורים: בדיקה + רמז */}
//                     <div style={{ display: 'flex', gap: '10px' }}>
//                         <button type="submit" style={{ flex: 1, padding: '15px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}>
//                             בדוק תשובה 🔍
//                         </button>
//                         <button type="button" onClick={handleGetHint} style={{ padding: '15px 25px', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}>
//                             רמז 💡
//                         </button>
//                     </div>
//                 </form>
//             </div>

//             {/* הקסם קורה כאן! אם יש משהו ב-modalConfig, הפופאפ יופיע */}
//             {modalConfig && (
//                 <Modal 
//                     title={modalConfig.title} 
//                     message={modalConfig.message} 
//                     onConfirm={modalConfig.onConfirm} 
//                     confirmType={modalConfig.confirmType} 
//                 />
//             )}
//         </div>
//     );
// };

// export default PlayRoom;
