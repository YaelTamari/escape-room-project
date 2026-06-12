import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createQuestion, getQuestionsByRoom, updateQuestion, deleteQuestion } from '../api/questionApi';

// הייבוא של הכלים הנקיים שלנו!
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import { useFetch } from '../hooks/useFetch';

const EMPTY_FORM = {
    story_text: '', question_text: '', question_type: 'text',
    correct_answer: '', hint_text: '', success_message: '',
    option_a: '', option_b: '', option_c: '', option_d: ''
};

const ManageRoomQuestions = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();

    // 1. שאיבת הנתונים הראשונית עם ההוק שלנו
    const { data, loading, error } = useFetch(getQuestionsByRoom, roomId);
    const [questions, setQuestions] = useState([]);
   
    const [selectedQuestionId, setSelectedQuestionId] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [isDirty, setIsDirty] = useState(false);

    // 2. סטייטים לניהול כל המודאלים (מחליפים את כל ה-alerts וה-confirms)
    const [successMessage, setSuccessMessage] = useState('');
    const [questionToDelete, setQuestionToDelete] = useState(null);
    const [pendingSwitch, setPendingSwitch] = useState(null); // שומר לאיזה שלב המשתמש ניסה לעבור
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);

    // עדכון הסטייט המקומי ברגע שההוק מסיים להביא נתונים
    useEffect(() => {
        if (data && data.questions) {
            setQuestions(data.questions);
        }
    }, [data]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setIsDirty(true);
    };

    // --- ניהול מעברים חכם עם מודאל במקום Confirm ---
    const handleSelectQuestion = (q) => {
        if (isDirty) {
            setPendingSwitch(q); // מדליק את מודאל האזהרה למעבר
            return;
        }
        executeSwitch(q);
    };

    const handleAddNewClick = () => {
        if (isDirty) {
            setPendingSwitch('NEW'); // מדליק את מודאל האזהרה למעבר
            return;
        }
        executeSwitch('NEW');
    };

    // הפונקציה שמופעלת רק אם אין שינויים, או אם המשתמש אישר במודאל לעבור בכל זאת
    const executeSwitch = (target) => {
        if (target === 'NEW') {
            setSelectedQuestionId(null);
            setFormData(EMPTY_FORM);
        } else {
            setSelectedQuestionId(target.id);
            setFormData({
                story_text: target.story_text || '', question_text: target.question_text || '', question_type: target.question_type || 'text',
                correct_answer: target.correct_answer || '', hint_text: target.hint_text || '', success_message: target.success_message || '',
                option_a: target.option_a || '', option_b: target.option_b || '', option_c: target.option_c || '', option_d: target.option_d || ''
            });
        }
        setIsDirty(false);
        setPendingSwitch(null); // מכבה את מודאל האזהרה
    };

    // --- שמירה ומחיקה (עדכון מקומי כדי לחסוך טעינות) ---
    const handleSubmitQuestion = async (e) => {
        e.preventDefault();
        try {
            if (selectedQuestionId) {
                const res = await updateQuestion(selectedQuestionId, formData);
                if (res && res.success) {
                    setSuccessMessage('השלב עודכן בהצלחה! ✨');
                    setIsDirty(false);
                    // עדכון אופטימי בלקוח
                    setQuestions(questions.map(q => q.id === selectedQuestionId ? { ...q, ...formData } : q));
                }
            } else {
                const newQuestionData = { ...formData, question_order: (questions?.length || 0) + 1 };
                const res = await createQuestion(roomId, newQuestionData);
                if (res && res.success) {
                    setSuccessMessage('השלב החדש נוסף לחדר בהצלחה! 🚀');
                    setIsDirty(false);
                    setFormData(EMPTY_FORM);
                    // מביאים את הרשימה המעודכנת מהשרת כדי לקבל את ה-ID החדש
                    const freshData = await getQuestionsByRoom(roomId);
                    if (freshData.success) setQuestions(freshData.questions);
                }
            }
        } catch (err) {
            alert('שגיאה בשמירת השאלה.');
        }
    };

    const handleDeleteClick = (id, e) => {
        e.stopPropagation();
        setQuestionToDelete(id); // מדליק מודאל מחיקה
    };

    const executeDelete = async () => {
        try {
            await deleteQuestion(questionToDelete);
            setQuestions(questions.filter(q => q.id !== questionToDelete));
           
            if (selectedQuestionId === questionToDelete) {
                setSelectedQuestionId(null);
                setFormData(EMPTY_FORM);
                setIsDirty(false);
            }
            setQuestionToDelete(null); // סוגר מודאל
            setSuccessMessage('השלב נמחק בהצלחה! 🗑️');
        } catch (err) {
            alert('שגיאה במחיקה.');
        }
    };

    // --- סיום החדר ---
    const handleFinishClick = () => {
        if (isDirty && (formData.question_text !== '' || formData.story_text !== '')) {
            setShowUnsavedModal(true);
            return;
        }
        if ((questions?.length || 0) < 5) {
            setShowWarningModal(true);
            return;
        }
        completeRoom();
    };

    const completeRoom = () => {
        setSuccessMessage('החדר נשמר ופורסם בהצלחה! 🏆');
        // ננווט לדשבורד רק אחרי שהוא לוחץ "אישור" על המודאל הירוק
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '100px' }}>טוען את נתוני החדר... ⏳</div>;
    if (error) return <div style={{ textAlign: 'center', color: 'red', marginTop: '100px' }}>{error}</div>;

    return (
        <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: 'Arial, sans-serif', direction: 'rtl' }}>
           
            {/* הסרגל העליון החדש שלנו! */}
            <Navbar />

            <div style={{ display: 'flex', gap: '20px', padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
               
                {/* --- עמודה 1: רשימת החידות והשלבים --- */}
                <div style={{ flex: '1.2', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#fff', padding: '15px', display: 'flex', flexDirection: 'column', maxHeight: '80vh', overflowY: 'auto' }}>
                    <h3 style={{ marginTop: 0, color: '#4b5563', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>
                        שלבי החדר ({questions.length})
                    </h3>
                   
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 }}>
                        {questions.map((q, index) => {
                            const isSelected = selectedQuestionId === q.id;
                            return (
                                <div
                                    key={q.id}
                                    onClick={() => handleSelectQuestion(q)}
                                    style={{ padding: '12px', border: isSelected ? '2px solid #8b5cf6' : '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', backgroundColor: isSelected ? '#f5f3ff' : '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                >
                                    <div>
                                        <strong style={{ color: isSelected ? '#6d28d9' : '#111827' }}>שלב {index + 1}</strong>
                                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
                                            {q.question_text}
                                        </div>
                                    </div>
                                    <button onClick={(e) => handleDeleteClick(q.id, e)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }} title="מחק שלב">
                                        🗑️
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <button onClick={handleAddNewClick} style={{ marginTop: '20px', padding: '12px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                        ➕ יצירת שלב חדש
                    </button>
                </div>

                {/* --- עמודה 2: אזור העריכה המרכזי --- */}
                <div style={{ flex: '3', border: '1px solid #d1d5db', padding: '25px', borderRadius: '8px', backgroundColor: '#fff', maxHeight: '80vh', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ margin: 0, color: '#111827' }}>
                            {selectedQuestionId ? '✏️ עריכת שלב קיים' : '✨ הוספת שלב חדש לחדר'}
                        </h2>
                        {isDirty && <span style={{ color: '#d97706', fontWeight: 'bold', fontSize: '14px' }}>* קיימים שינויים שלא נשמרו</span>}
                    </div>
                   
                    <form onSubmit={handleSubmitQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <label style={{ fontWeight: 'bold', color: '#374151' }}>טקסט סיפור (העלילה שלפני החידה):</label>
                        <textarea name="story_text" value={formData.story_text} onChange={handleInputChange} rows="3" placeholder="למשל: הדלת נפתחה והגעתם לחדר חשוך..." style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }} />

                        <label style={{ fontWeight: 'bold', color: '#374151' }}>חידה / שאלה (*חובה):</label>
                        <input type="text" name="question_text" value={formData.question_text} onChange={handleInputChange} required placeholder="למשל: מה הקוד למנעול?" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }} />

                        <label style={{ fontWeight: 'bold', color: '#374151' }}>סוג החידה:</label>
                        <select name="question_type" value={formData.question_type} onChange={handleInputChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }}>
                            <option value="text">הזנת טקסט חופשי</option>
                            <option value="multiple_choice">שאלת אמריקאית (בחירה מרובה)</option>
                        </select>

                        {formData.question_type === 'multiple_choice' && (
                            <div style={{ padding: '15px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <p style={{ margin: 0, fontWeight: 'bold', color: '#1e40af' }}>הזן את אפשרויות הבחירה לשחקן:</p>
                                <input type="text" name="option_a" value={formData.option_a} onChange={handleInputChange} placeholder="אפשרות א'" style={{ padding: '8px', border: '1px solid #93c5fd', borderRadius: '4px' }} />
                                <input type="text" name="option_b" value={formData.option_b} onChange={handleInputChange} placeholder="אפשרות ב'" style={{ padding: '8px', border: '1px solid #93c5fd', borderRadius: '4px' }} />
                                <input type="text" name="option_c" value={formData.option_c} onChange={handleInputChange} placeholder="אפשרות ג'" style={{ padding: '8px', border: '1px solid #93c5fd', borderRadius: '4px' }} />
                                <input type="text" name="option_d" value={formData.option_d} onChange={handleInputChange} placeholder="אפשרות ד'" style={{ padding: '8px', border: '1px solid #93c5fd', borderRadius: '4px' }} />
                            </div>
                        )}

                        <label style={{ fontWeight: 'bold', color: '#374151' }}>תשובה נכונה (*חובה):</label>
                        <input type="text" name="correct_answer" value={formData.correct_answer} onChange={handleInputChange} required placeholder="התשובה שתעביר את השחקן שלב" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }} />

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <label style={{ fontWeight: 'bold', color: '#374151', marginBottom: '5px' }}>רמז (אופציונלי):</label>
                                <input type="text" name="hint_text" value={formData.hint_text} onChange={handleInputChange} placeholder="רמז לשחקנים שנתקעו..." style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }} />
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <label style={{ fontWeight: 'bold', color: '#374151', marginBottom: '5px' }}>הודעת הצלחה:</label>
                                <input type="text" name="success_message" value={formData.success_message} onChange={handleInputChange} placeholder="למשל: כל הכבוד!" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }} />
                            </div>
                        </div>

                        <button type="submit" disabled={!isDirty} style={{ padding: '15px', background: isDirty ? '#10b981' : '#9ca3af', color: '#fff', border: 'none', borderRadius: '6px', cursor: isDirty ? 'pointer' : 'not-allowed', fontSize: '16px', fontWeight: 'bold', marginTop: '15px', transition: '0.2s' }}>
                            {selectedQuestionId ? '💾 שמור עדכונים לשלב זה' : '➕ שמור שלב חדש לחדר'}
                        </button>
                    </form>
                </div>

                {/* --- עמודה 3: אלמנטים וסיום החדר --- */}
                <div style={{ flex: '1', border: '1px solid #d1d5db', padding: '20px', borderRadius: '8px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ marginTop: 0, color: '#4b5563' }}>ניהול אלמנטים</h3>
                        <p style={{ fontSize: '14px', color: '#6b7280' }}>הוספת רכיבים לחדר:</p>
                        <button style={{ width: '100%', padding: '12px', marginBottom: '10px', cursor: 'pointer', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', fontWeight: 'bold' }}>+ הוסף פופ-אפ</button>
                        <button style={{ width: '100%', padding: '12px', marginBottom: '10px', cursor: 'pointer', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', fontWeight: 'bold' }}>+ הוסף תמונה</button>
                        <button style={{ width: '100%', padding: '12px', marginBottom: '10px', cursor: 'pointer', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', fontWeight: 'bold' }}>+ הוסף קובץ שמע</button>
                    </div>

                    <div style={{ marginTop: '30px' }}>
                        <hr style={{ borderColor: '#e5e7eb', marginBottom: '20px' }} />
                        <button onClick={handleFinishClick} style={{ padding: '15px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', width: '100%', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)' }}>
                            סיום ושמירת החדר
                        </button>
                    </div>
                </div>
            </div>

            {/* --- אזור המודאלים הגנריים --- */}

            {pendingSwitch && (
                <Modal
                    title="⚠️ שינויים לא שמורים"
                    titleColor="#d97706"
                    message="יש לך שינויים שלא שמרת בטופס הנוכחי. האם לעזוב ולמחוק את השינויים?"
                    confirmText="כן, עזוב ללא שמירה"
                    confirmType="danger"
                    onConfirm={() => executeSwitch(pendingSwitch)}
                    cancelText="חזור לשמור"
                    onCancel={() => setPendingSwitch(null)}
                />
            )}

            {questionToDelete && (
                <Modal
                    title="מחיקת שלב"
                    message="האם אתה בטוח שברצונך למחוק שלב זה לצמיתות?"
                    confirmText="כן, מחק!"
                    confirmType="danger"
                    onConfirm={executeDelete}
                    cancelText="ביטול"
                    onCancel={() => setQuestionToDelete(null)}
                />
            )}

            {showUnsavedModal && (
                <Modal
                    title="⚠️ טופס לא שמור"
                    titleColor="#d97706"
                    message="התחלת לכתוב מידע בטופס אבל עדיין לא לחצת על שמור. לסיים את החדר בכל זאת?"
                    confirmText="סיים ללא שמירה"
                    confirmType="danger"
                    onConfirm={() => { setShowUnsavedModal(false); completeRoom(); }}
                    cancelText="חזור לשמור"
                    onCancel={() => setShowUnsavedModal(false)}
                />
            )}

            {showWarningModal && (
                <Modal
                    title="מומלץ להוסיף חידות"
                    titleColor="#3b82f6"
                    message={`שמנו לב שיצרת רק ${questions.length} שלבים. מומלץ ליצור לפחות 5 שלבים לחוויה מושלמת.`}
                    confirmText="סיום ופרסום"
                    confirmType="primary"
                    onConfirm={completeRoom}
                    cancelText="חזור להוסיף"
                    onCancel={() => setShowWarningModal(false)}
                />
            )}

            {successMessage && (
                <Modal
                    title="פעולה הושלמה"
                    titleColor="#10b981"
                    message={successMessage}
                    confirmText="המשך"
                    confirmType="success"
                    onConfirm={() => {
                        setSuccessMessage('');
                        if (successMessage.includes('נשמר ופורסם')) navigate('/developer');
                    }}
                />
            )}

        </div>
    );
};

export default ManageRoomQuestions;








// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { createQuestion, getQuestionsByRoom, updateQuestion, deleteQuestion } from '../api/questionApi'; 

// const EMPTY_FORM = {
//     story_text: '', question_text: '', question_type: 'text',
//     correct_answer: '', hint_text: '', success_message: '',
//     option_a: '', option_b: '', option_c: '', option_d: ''
// };

// const ManageRoomQuestions = () => {
//     const { roomId } = useParams();
//     const navigate = useNavigate();

//     const [questions, setQuestions] = useState([]); 
//     const [loading, setLoading] = useState(true); 
    
//     // סטייט שקובע איזו שאלה אנחנו עורכים עכשיו (null אומר שאנחנו יוצרים חידה חדשה)
//     const [selectedQuestionId, setSelectedQuestionId] = useState(null); 
//     const [formData, setFormData] = useState(EMPTY_FORM);
    
//     // סטייט חכם למעקב: האם היוצר הקליד משהו בטופס אבל עדיין לא לחץ "שמור"?
//     const [isDirty, setIsDirty] = useState(false);

//     // חלונות קופצים (מודאלים)
//     const [showWarningModal, setShowWarningModal] = useState(false); // פחות מ-5 שאלות
//     const [showUnsavedModal, setShowUnsavedModal] = useState(false); // ניסיון לסיים חדר לפני שמירה

//     useEffect(() => {
//         if (roomId) fetchQuestions();
//     }, [roomId]);

//     const fetchQuestions = async () => {
//         try {
//             setLoading(true);
//             const res = await getQuestionsByRoom(roomId);
//             if (res && res.success && Array.isArray(res.questions)) {
//                 setQuestions(res.questions);
//             }
//         } catch (err) {
//             console.error('Error fetching questions:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // כשמקלידים בטופס - מדליקים את נורת האזהרה (isDirty = true)
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//         setIsDirty(true); 
//     };

//     // בחירת שאלה מהתפריט לעריכה
//     const handleSelectQuestion = (q) => {
//         if (isDirty) {
//             if (!window.confirm('יש לך שינויים שלא שמרת בטופס הנוכחי. האם לעבור שלב בכל זאת? (השינויים לא יישמרו)')) {
//                 return; // עוצר את המעבר אם הוא מתחרט
//             }
//         }
//         setSelectedQuestionId(q.id);
//         setFormData({
//             story_text: q.story_text || '', question_text: q.question_text || '', question_type: q.question_type || 'text',
//             correct_answer: q.correct_answer || '', hint_text: q.hint_text || '', success_message: q.success_message || '',
//             option_a: q.option_a || '', option_b: q.option_b || '', option_c: q.option_c || '', option_d: q.option_d || ''
//         });
//         setIsDirty(false); // איפסנו את המעקב כי כרגע הטופס מסונכרן עם השרת
//     };

//     // לחיצה על "יצירת שלב חדש"
//     const handleAddNewClick = () => {
//         if (isDirty) {
//             if (!window.confirm('יש לך שינויים שלא שמרת. האם לנקות את הטופס בכל זאת ולהתחיל חידה חדשה?')) {
//                 return;
//             }
//         }
//         setSelectedQuestionId(null);
//         setFormData(EMPTY_FORM);
//         setIsDirty(false);
//     };

//     // שמירה (או יצירה חדשה, או עדכון קיימת)
//     const handleSubmitQuestion = async (e) => {
//         e.preventDefault(); 
//         try {
//             if (selectedQuestionId) {
//                 // מצב עריכה: מעדכנים שאלה קיימת
//                 const res = await updateQuestion(selectedQuestionId, formData);
//                 if (res && res.success) {
//                     alert('השלב עודכן בהצלחה! ✨');
//                     setIsDirty(false);
//                     fetchQuestions();
//                 }
//             } else {
//                 // מצב יצירה: שומרים שאלה חדשה
//                 const newQuestionData = { ...formData, question_order: (questions?.length || 0) + 1 };
//                 const res = await createQuestion(roomId, newQuestionData);
//                 if (res && res.success) {
//                     alert('השלב החדש נוסף לחדר בהצלחה! 🚀');
//                     setIsDirty(false);
//                     setFormData(EMPTY_FORM);
//                     fetchQuestions();
//                 }
//             }
//         } catch (err) {
//             alert('שגיאה בשמירת השאלה.');
//         }
//     };

//     // מחיקת שאלה
//     const handleDeleteQuestion = async (id, e) => {
//         e.stopPropagation(); // מונע בחירה של השאלה כשלוחצים על הפח
//         if (window.confirm('האם אתה בטוח שברצונך למחוק שלב זה לצמיתות?')) {
//             try {
//                 await deleteQuestion(id);
//                 // אם מחקנו את השאלה שאנחנו כרגע עורכים - מנקים את הטופס
//                 if (selectedQuestionId === id) {
//                     setSelectedQuestionId(null);
//                     setFormData(EMPTY_FORM);
//                     setIsDirty(false);
//                 }
//                 fetchQuestions();
//             } catch (err) {
//                 alert('שגיאה במחיקה.');
//             }
//         }
//     };

//     // סיום החדר - כולל שומרי סף!
//     const handleFinishClick = () => {
//         // בדיקה 1: האם הטופס לא שמור?
//         if (isDirty && (formData.question_text !== '' || formData.story_text !== '')) {
//             setShowUnsavedModal(true);
//             return;
//         }
//         // בדיקה 2: האם יש מספיק חידות?
//         if ((questions?.length || 0) < 5) {
//             setShowWarningModal(true); 
//             return;
//         }
//         completeRoom(); 
//     };

//     const completeRoom = () => {
//         alert('החדר נשמר ופורסם בהצלחה! 🏆');
//         navigate('/developer');
//     };

//     if (loading) return <div style={{ textAlign: 'center', marginTop: '100px' }}>טוען את נתוני החדר... ⏳</div>;

//     return (
//         <div style={{ display: 'flex', gap: '20px', padding: '20px', direction: 'rtl', fontFamily: 'Arial, sans-serif', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
            
//             {/* --- עמודה 1: רשימת החידות והשלבים (תפריט צד) --- */}
//             <div style={{ flex: '1.2', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#fff', padding: '15px', display: 'flex', flexDirection: 'column', maxHeight: '85vh', overflowY: 'auto' }}>
//                 <h3 style={{ marginTop: 0, color: '#4b5563', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>
//                     שלבי החדר ({questions.length})
//                 </h3>
                
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 }}>
//                     {questions.map((q, index) => {
//                         const isSelected = selectedQuestionId === q.id;
//                         return (
//                             <div 
//                                 key={q.id} 
//                                 onClick={() => handleSelectQuestion(q)}
//                                 style={{ 
//                                     padding: '12px', border: isSelected ? '2px solid #8b5cf6' : '1px solid #e5e7eb', 
//                                     borderRadius: '6px', cursor: 'pointer', backgroundColor: isSelected ? '#f5f3ff' : '#fff',
//                                     display: 'flex', justifyContent: 'space-between', alignItems: 'center'
//                                 }}
//                             >
//                                 <div>
//                                     <strong style={{ color: isSelected ? '#6d28d9' : '#111827' }}>שלב {index + 1}</strong>
//                                     <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
//                                         {q.question_text}
//                                     </div>
//                                 </div>
//                                 <button onClick={(e) => handleDeleteQuestion(q.id, e)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }} title="מחק שלב">
//                                     🗑️
//                                 </button>
//                             </div>
//                         );
//                     })}
//                 </div>

//                 <button 
//                     onClick={handleAddNewClick} 
//                     style={{ marginTop: '20px', padding: '12px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
//                     ➕ יצירת שלב חדש
//                 </button>
//             </div>

//             {/* --- עמודה 2: אזור העריכה המרכזי (הטופס) --- */}
//             <div style={{ flex: '3', border: '1px solid #d1d5db', padding: '25px', borderRadius: '8px', backgroundColor: '#fff' }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//                     <h2 style={{ margin: 0, color: '#111827' }}>
//                         {selectedQuestionId ? '✏️ עריכת שלב קיים' : '✨ הוספת שלב חדש לחדר'}
//                     </h2>
//                     {isDirty && <span style={{ color: '#d97706', fontWeight: 'bold', fontSize: '14px' }}>* קיימים שינויים שלא נשמרו</span>}
//                 </div>
                
//                 <form onSubmit={handleSubmitQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
//                     <label style={{ fontWeight: 'bold', color: '#374151' }}>טקסט סיפור (העלילה שלפני החידה):</label>
//                     <textarea name="story_text" value={formData.story_text} onChange={handleInputChange} rows="3" placeholder="למשל: הדלת נפתחה והגעתם לחדר חשוך..." style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }} />

//                     <label style={{ fontWeight: 'bold', color: '#374151' }}>חידה / שאלה (*חובה):</label>
//                     <input type="text" name="question_text" value={formData.question_text} onChange={handleInputChange} required placeholder="למשל: מה הקוד למנעול?" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }} />

//                     <label style={{ fontWeight: 'bold', color: '#374151' }}>סוג החידה:</label>
//                     <select name="question_type" value={formData.question_type} onChange={handleInputChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }}>
//                         <option value="text">הזנת טקסט חופשי</option>
//                         <option value="multiple_choice">שאלת אמריקאית (בחירה מרובה)</option>
//                     </select>

//                     {formData.question_type === 'multiple_choice' && (
//                         <div style={{ padding: '15px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
//                             <p style={{ margin: 0, fontWeight: 'bold', color: '#1e40af' }}>הזן את אפשרויות הבחירה לשחקן:</p>
//                             <input type="text" name="option_a" value={formData.option_a} onChange={handleInputChange} placeholder="אפשרות א'" style={{ padding: '8px', border: '1px solid #93c5fd', borderRadius: '4px' }} />
//                             <input type="text" name="option_b" value={formData.option_b} onChange={handleInputChange} placeholder="אפשרות ב'" style={{ padding: '8px', border: '1px solid #93c5fd', borderRadius: '4px' }} />
//                             <input type="text" name="option_c" value={formData.option_c} onChange={handleInputChange} placeholder="אפשרות ג'" style={{ padding: '8px', border: '1px solid #93c5fd', borderRadius: '4px' }} />
//                             <input type="text" name="option_d" value={formData.option_d} onChange={handleInputChange} placeholder="אפשרות ד'" style={{ padding: '8px', border: '1px solid #93c5fd', borderRadius: '4px' }} />
//                         </div>
//                     )}

//                     <label style={{ fontWeight: 'bold', color: '#374151' }}>תשובה נכונה (*חובה):</label>
//                     <input type="text" name="correct_answer" value={formData.correct_answer} onChange={handleInputChange} required placeholder="התשובה שתעביר את השחקן שלב" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }} />

//                     <div style={{ display: 'flex', gap: '15px' }}>
//                         <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
//                             <label style={{ fontWeight: 'bold', color: '#374151', marginBottom: '5px' }}>רמז (אופציונלי):</label>
//                             <input type="text" name="hint_text" value={formData.hint_text} onChange={handleInputChange} placeholder="רמז לשחקנים שנתקעו..." style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }} />
//                         </div>
//                         <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
//                             <label style={{ fontWeight: 'bold', color: '#374151', marginBottom: '5px' }}>הודעת הצלחה:</label>
//                             <input type="text" name="success_message" value={formData.success_message} onChange={handleInputChange} placeholder="למשל: כל הכבוד!" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }} />
//                         </div>
//                     </div>

//                     <button type="submit" disabled={!isDirty} style={{ padding: '15px', background: isDirty ? '#10b981' : '#9ca3af', color: '#fff', border: 'none', borderRadius: '6px', cursor: isDirty ? 'pointer' : 'not-allowed', fontSize: '16px', fontWeight: 'bold', marginTop: '15px', transition: '0.2s' }}>
//                         {selectedQuestionId ? '💾 שמור עדכונים לשלב זה' : '➕ שמור שלב חדש לחדר'}
//                     </button>
//                 </form>
//             </div>

//             {/* --- עמודה 3: אלמנטים וסיום החדר --- */}
//             <div style={{ flex: '1', border: '1px solid #d1d5db', padding: '20px', borderRadius: '8px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
//                 <div>
//                     <h3 style={{ marginTop: 0, color: '#4b5563' }}>ניהול אלמנטים</h3>
//                     <p style={{ fontSize: '14px', color: '#6b7280' }}>הוספת רכיבים לחדר:</p>
//                     <button style={{ width: '100%', padding: '12px', marginBottom: '10px', cursor: 'pointer', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', fontWeight: 'bold' }}>+ הוסף פופ-אפ</button>
//                     <button style={{ width: '100%', padding: '12px', marginBottom: '10px', cursor: 'pointer', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', fontWeight: 'bold' }}>+ הוסף תמונה</button>
//                     <button style={{ width: '100%', padding: '12px', marginBottom: '10px', cursor: 'pointer', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', fontWeight: 'bold' }}>+ הוסף קובץ שמע</button>
//                 </div>

//                 <div style={{ marginTop: '30px' }}>
//                     <hr style={{ borderColor: '#e5e7eb', marginBottom: '20px' }} />
//                     <button onClick={handleFinishClick} style={{ padding: '15px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', width: '100%', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)' }}>
//                         סיום ושמירת החדר
//                     </button>
//                 </div>
//             </div>

//             {/* מודאל 1: אזהרה על חוסר שמירה */}
//             {showUnsavedModal && (
//                 <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
//                     <div style={{ background: '#fff', padding: '30px', borderRadius: '10px', textAlign: 'center', maxWidth: '400px' }}>
//                         <h3 style={{ color: '#d97706', marginTop: 0 }}>⚠️ שינויים לא שמורים!</h3>
//                         <p>התחלת לכתוב מידע בטופס אבל עדיין לא לחצת על "שמור שלב". אם תסיים עכשיו, המידע הזה יימחק.</p>
//                         <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '25px' }}>
//                             <button onClick={() => { setShowUnsavedModal(false); completeRoom(); }} style={{ background: '#ef4444', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
//                                 צא ללא שמירה
//                             </button>
//                             <button onClick={() => setShowUnsavedModal(false)} style={{ background: '#10b981', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
//                                 חזור לשמור
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* מודאל 2: אזהרה על פחות מ-5 שאלות */}
//             {showWarningModal && (
//                 <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
//                     <div style={{ background: '#fff', padding: '30px', borderRadius: '10px', textAlign: 'center', maxWidth: '400px' }}>
//                         <h3 style={{ color: '#3b82f6', marginTop: 0 }}>רגע אחד...</h3>
//                         <p>שמנו לב שיצרת רק <strong>{questions.length}</strong> שלבים. מומלץ ליצור לפחות 5 שלבים לחוויה מושלמת.</p>
//                         <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '25px' }}>
//                             <button onClick={completeRoom} style={{ background: '#3b82f6', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
//                                 כן, סיים ופרסם
//                             </button>
//                             <button onClick={() => setShowWarningModal(false)} style={{ background: '#6b7280', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
//                                 חזור להוסיף חידות
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ManageRoomQuestions;