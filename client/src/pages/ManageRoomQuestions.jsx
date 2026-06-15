import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createQuestion, getQuestionsByRoom, updateQuestion, deleteQuestion } from '../api/questionApi';
import Navbar from '../components/Navbar/Navbar';
import Modal from '../components/Modal/Modal';
import { useFetch } from '../hooks/useFetch';

// ייבוא הקומפוננטה הגנרית החדשה לניהול האביזרים והפופ-אפים
import RoomElementsManager from '../components/RoomElementsManager/RoomElementsManager';

const EMPTY_FORM = {
    story_text: '', question_text: '', question_type: 'text',
    correct_answer: '', hint_text: '', success_message: '',
    option_a: '', option_b: '', option_c: '', option_d: ''
};

const ManageRoomQuestions = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();

    // שאיבת הנתונים של השאלות
    const { data, loading, error } = useFetch(getQuestionsByRoom, roomId);
    const [questions, setQuestions] = useState([]);

    const [selectedQuestionId, setSelectedQuestionId] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [isDirty, setIsDirty] = useState(false);

    // ניהול מודאלים נקי
    const [successMessage, setSuccessMessage] = useState('');
    const [questionToDelete, setQuestionToDelete] = useState(null);
    const [pendingSwitch, setPendingSwitch] = useState(null);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);

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

    const handleSelectQuestion = (q) => {
        if (isDirty) {
            setPendingSwitch(q);
            return;
        }
        executeSwitch(q);
    };

    const handleAddNewClick = () => {
        if (isDirty) {
            setPendingSwitch('NEW');
            return;
        }
        executeSwitch('NEW');
    };

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
        setPendingSwitch(null);
    };

    const handleSubmitQuestion = async (e) => {
        e.preventDefault();
        try {
            if (selectedQuestionId) {
                const res = await updateQuestion(selectedQuestionId, formData);
                if (res && res.success) {
                    setSuccessMessage('השלב עודכן בהצלחה! ✨');
                    setIsDirty(false);
                    setQuestions(questions.map(q => q.id === selectedQuestionId ? { ...q, ...formData } : q));
                }
            } else {
                const newQuestionData = { ...formData, question_order: (questions?.length || 0) + 1 };
                const res = await createQuestion(roomId, newQuestionData);
                if (res && res.success) {
                    setSuccessMessage('השלב החדש נוסף לחדר בהצלחה! 🚀');
                    setIsDirty(false);
                    setFormData(EMPTY_FORM);
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
        setQuestionToDelete(id);
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
            setQuestionToDelete(null);
            setSuccessMessage('השלב נמחק בהצלחה! 🗑️');
        } catch (err) {
            alert('שגיאה במחיקה.');
        }
    };

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
        setSuccessMessage('החדר נשמר בהצלחה! 🏆');
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '100px' }}>טוען את נתוני החדר... ⏳</div>;
    if (error) return <div style={{ textAlign: 'center', color: 'red', marginTop: '100px' }}>{error}</div>;

    return (
        <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: 'Arial, sans-serif', direction: 'rtl' }}>
            <Navbar />
            
            {/* מיכל ראשי גמיש שמחלק את המסך ל-3 עמודות אינטראקטיביות */}
            <div style={{ display: 'flex', gap: '20px', padding: '20px', maxWidth: '1600px', margin: '0 auto', alignItems: 'flex-start' }}>

                {/* עמודה 1: רשימת שאלות בצד */}
                <div style={{ flex: '1.2', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#fff', padding: '15px', display: 'flex', flexDirection: 'column', maxHeight: '85vh', overflowY: 'auto' }}>
                    <h3 style={{ marginTop: 0, color: '#4b5563', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>
                        שלבי החדר ({questions.length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 }}>
                        {questions.map((q, index) => (
                            <div key={q.id} onClick={() => handleSelectQuestion(q)} style={{ padding: '12px', border: selectedQuestionId === q.id ? '2px solid #8b5cf6' : '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', backgroundColor: selectedQuestionId === q.id ? '#f5f3ff' : '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong style={{ color: selectedQuestionId === q.id ? '#6d28d9' : '#111827' }}>שלב {index + 1}</strong>
                                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
                                        {q.question_text}
                                    </div>
                                </div>
                                <button type="button" onClick={(e) => handleDeleteClick(q.id, e)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }} title="מחק שלב">🗑️</button>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={handleAddNewClick} style={{ marginTop: '20px', padding: '12px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                        ➕ יצירת שלב חדש
                    </button>
                </div>

                {/* עמודה 2: טופס עריכת השאלה והעלילה */}
                <div style={{ flex: '2.5', border: '1px solid #d1d5db', padding: '25px', borderRadius: '8px', backgroundColor: '#fff', maxHeight: '85vh', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ margin: 0, color: '#111827' }}>{selectedQuestionId ? '✏️ עריכת שלב קיים' : '✨ הוספת שלב חדש'}</h2>
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
                                <input type="text" name="option_a" value={formData.option_a} onChange={handleInputChange} placeholder="אפשרות א'" style={{ padding: '8px', border: '1px solid #93c5fd', borderRadius: '4px' }} />
                                <input type="text" name="option_b" value={formData.option_b} onChange={handleInputChange} placeholder="אפשרות ב'" style={{ padding: '8px', border: '1px solid #93c5fd', borderRadius: '4px' }} />
                                <input type="text" name="option_c" value={formData.option_c} onChange={handleInputChange} placeholder="אפשרות ג'" style={{ padding: '8px', border: '1px solid #93c5fd', borderRadius: '4px' }} />
                                <input type="text" name="option_d" value={formData.option_d} onChange={handleInputChange} placeholder="אפשרות ד'" style={{ padding: '8px', border: '1px solid #93c5fd', borderRadius: '4px' }} />
                            </div>
                        )}

                        <label style={{ fontWeight: 'bold', color: '#374151' }}>תשובה נכונה (*חובה):</label>
                        <input type="text" name="correct_answer" value={formData.correct_answer} onChange={handleInputChange} required placeholder="התשובה" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }} />

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <label style={{ fontWeight: 'bold', color: '#374151', marginBottom: '5px' }}>רמז (אופציונלי):</label>
                                <input type="text" name="hint_text" value={formData.hint_text} onChange={handleInputChange} placeholder="רמז לשחקנים..." style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }} />
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <label style={{ fontWeight: 'bold', color: '#374151', marginBottom: '5px' }}>הודעת הצלחה:</label>
                                <input type="text" name="success_message" value={formData.success_message} onChange={handleInputChange} placeholder="למשל: כל הכבוד!" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }} />
                            </div>
                        </div>

                        <button type="submit" disabled={!isDirty} style={{ padding: '15px', background: isDirty ? '#10b981' : '#9ca3af', color: '#fff', border: 'none', borderRadius: '6px', cursor: isDirty ? 'pointer' : 'not-allowed', fontSize: '16px', fontWeight: 'bold', marginTop: '15px' }}>
                            {selectedQuestionId ? '💾 שמור עדכונים לשלב זה' : '➕ שמור שלב חדש'}
                        </button>
                    </form>
                </div>

                {/* עמודה 3: סיום חדר + פאנל ניהול האביזרים החדש והעצמאי */}
                <div style={{ flex: '1.3', display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '20px', maxHeight: '85vh', overflowY: 'auto' }}>
                    
                    {/* תיבת סיום החדר המקורית */}
                    <div style={{ border: '1px solid #d1d5db', padding: '20px', borderRadius: '8px', backgroundColor: '#fff' }}>
                         <h3 style={{ marginTop: 0, color: '#4b5563', textAlign: 'center' }}>סיום עריכה</h3>
                         <p style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center' }}>לאחר שסיימת להזין את כל חידות החדר, לחץ כאן.</p>
                         <button type="button" onClick={handleFinishClick} style={{ padding: '15px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', width: '100%', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '20px' }}>
                             סיום ושמירת החדר
                         </button>
                    </div>

                    {/* החלק החדש והיוקרתי: רכיב ניהול האביזרים הגנרי מבלי לשכפל שום לוגיקה */}
                    <RoomElementsManager roomId={roomId} />

                </div>
            </div>

            {/* מודאלים נקיים */}
            {pendingSwitch && (
                <Modal title="⚠️ שינויים לא שמורים" titleColor="#d97706" message="האם לעזוב ללא שמירה?" confirmText="כן" confirmType="danger" onConfirm={() => executeSwitch(pendingSwitch)} cancelText="ביטול" onCancel={() => setPendingSwitch(null)} />
            )}
            {questionToDelete && (
                <Modal title="מחיקת שלב" message="בטוח שברצונך למחוק?" confirmText="כן, מחק!" confirmType="danger" onConfirm={executeDelete} cancelText="ביטול" onCancel={() => setQuestionToDelete(null)} />
            )}
            {showUnsavedModal && (
                <Modal title="⚠️ טופס לא שמור" titleColor="#d97706" message="לסיים את החדר למרות שלא שמרת את השאלה הנוכחית?" confirmText="סיים ללא שמירה" confirmType="danger" onConfirm={() => { setShowUnsavedModal(false); completeRoom(); }} cancelText="חזור לשמור" onCancel={() => setShowUnsavedModal(false)} />
            )}
            {showWarningModal && (
                <Modal title="מומלץ להוסיף חידות" titleColor="#3b82f6" message={`יצרת רק ${questions.length} שלבים. מומלץ לפחות 5.`} confirmText="סיום בכל זאת" confirmType="primary" onConfirm={completeRoom} cancelText="חזור להוסיף" onCancel={() => setShowWarningModal(false)} />
            )}
            {successMessage && (
                <Modal title="פעולה הושלמה" titleColor="#10b981" message={successMessage} confirmText="המשך" confirmType="success" onConfirm={() => { setSuccessMessage(''); if (successMessage.includes('נשמר בהצלחה')) navigate('/developer'); }} />
            )}
        </div>
    );
};

export default ManageRoomQuestions;
















// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { createQuestion, getQuestionsByRoom, updateQuestion, deleteQuestion } from '../api/questionApi';
// import Navbar from '../components/Navbar/Navbar';
// import Modal from '../components/Modal/Modal';
// import { useFetch } from '../hooks/useFetch';

// import RoomElementsManager from '../components/RoomElementsManager/RoomElementsManager';

// const EMPTY_FORM = {
//     story_text: '', question_text: '', question_type: 'text',
//     correct_answer: '', hint_text: '', success_message: '',
//     option_a: '', option_b: '', option_c: '', option_d: ''
// };

// const ManageRoomQuestions = () => {
//     const { roomId } = useParams();
//     const navigate = useNavigate();

//     // שאיבת הנתונים של השאלות
//     const { data, loading, error } = useFetch(getQuestionsByRoom, roomId);
//     const [questions, setQuestions] = useState([]);

//     const [selectedQuestionId, setSelectedQuestionId] = useState(null);
//     const [formData, setFormData] = useState(EMPTY_FORM);
//     const [isDirty, setIsDirty] = useState(false);

//     // ניהול מודאלים נקי
//     const [successMessage, setSuccessMessage] = useState('');
//     const [questionToDelete, setQuestionToDelete] = useState(null);
//     const [pendingSwitch, setPendingSwitch] = useState(null);
//     const [showWarningModal, setShowWarningModal] = useState(false);
//     const [showUnsavedModal, setShowUnsavedModal] = useState(false);

//     useEffect(() => {
//         if (data && data.questions) {
//             setQuestions(data.questions);
//         }
//     }, [data]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//         setIsDirty(true);
//     };

//     const handleSelectQuestion = (q) => {
//         if (isDirty) {
//             setPendingSwitch(q);
//             return;
//         }
//         executeSwitch(q);
//     };

//     const handleAddNewClick = () => {
//         if (isDirty) {
//             setPendingSwitch('NEW');
//             return;
//         }
//         executeSwitch('NEW');
//     };

//     const executeSwitch = (target) => {
//         if (target === 'NEW') {
//             setSelectedQuestionId(null);
//             setFormData(EMPTY_FORM);
//         } else {
//             setSelectedQuestionId(target.id);
//             setFormData({
//                 story_text: target.story_text || '', question_text: target.question_text || '', question_type: target.question_type || 'text',
//                 correct_answer: target.correct_answer || '', hint_text: target.hint_text || '', success_message: target.success_message || '',
//                 option_a: target.option_a || '', option_b: target.option_b || '', option_c: target.option_c || '', option_d: target.option_d || ''
//             });
//         }
//         setIsDirty(false);
//         setPendingSwitch(null);
//     };

//     const handleSubmitQuestion = async (e) => {
//         e.preventDefault();
//         try {
//             if (selectedQuestionId) {
//                 const res = await updateQuestion(selectedQuestionId, formData);
//                 if (res && res.success) {
//                     setSuccessMessage('השלב עודכן בהצלחה! ✨');
//                     setIsDirty(false);
//                     setQuestions(questions.map(q => q.id === selectedQuestionId ? { ...q, ...formData } : q));
//                 }
//             } else {
//                 const newQuestionData = { ...formData, question_order: (questions?.length || 0) + 1 };
//                 const res = await createQuestion(roomId, newQuestionData);
//                 if (res && res.success) {
//                     setSuccessMessage('השלב החדש נוסף לחדר בהצלחה! 🚀');
//                     setIsDirty(false);
//                     setFormData(EMPTY_FORM);
//                     const freshData = await getQuestionsByRoom(roomId);
//                     if (freshData.success) setQuestions(freshData.questions);
//                 }
//             }
//         } catch (err) {
//             alert('שגיאה בשמירת השאלה.');
//         }
//     };

//     const handleDeleteClick = (id, e) => {
//         e.stopPropagation();
//         setQuestionToDelete(id);
//     };

//     const executeDelete = async () => {
//         try {
//             await deleteQuestion(questionToDelete);
//             setQuestions(questions.filter(q => q.id !== questionToDelete));

//             if (selectedQuestionId === questionToDelete) {
//                 setSelectedQuestionId(null);
//                 setFormData(EMPTY_FORM);
//                 setIsDirty(false);
//             }
//             setQuestionToDelete(null);
//             setSuccessMessage('השלב נמחק בהצלחה! 🗑️');
//         } catch (err) {
//             alert('שגיאה במחיקה.');
//         }
//     };

//     const handleFinishClick = () => {
//         if (isDirty && (formData.question_text !== '' || formData.story_text !== '')) {
//             setShowUnsavedModal(true);
//             return;
//         }
//         if ((questions?.length || 0) < 5) {
//             setShowWarningModal(true);
//             return;
//         }
//         completeRoom();
//     };

//     const completeRoom = () => {
//         setSuccessMessage('החדר נשמר בהצלחה! 🏆');
//     };

//     if (loading) return <div style={{ textAlign: 'center', marginTop: '100px' }}>טוען את נתוני החדר... ⏳</div>;
//     if (error) return <div style={{ textAlign: 'center', color: 'red', marginTop: '100px' }}>{error}</div>;

//     return (
//         <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: 'Arial, sans-serif', direction: 'rtl' }}>
//             <Navbar />
//             <div style={{ display: 'flex', gap: '20px', padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>

//                 {/* רשימת שאלות בצד */}
//                 <div style={{ flex: '1.2', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#fff', padding: '15px', display: 'flex', flexDirection: 'column', maxHeight: '80vh', overflowY: 'auto' }}>
//                     <h3 style={{ marginTop: 0, color: '#4b5563', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>
//                         שלבי החדר ({questions.length})
//                     </h3>
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 }}>
//                         {questions.map((q, index) => (
//                             <div key={q.id} onClick={() => handleSelectQuestion(q)} style={{ padding: '12px', border: selectedQuestionId === q.id ? '2px solid #8b5cf6' : '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', backgroundColor: selectedQuestionId === q.id ? '#f5f3ff' : '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                                 <div>
//                                     <strong style={{ color: selectedQuestionId === q.id ? '#6d28d9' : '#111827' }}>שלב {index + 1}</strong>
//                                     <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
//                                         {q.question_text}
//                                     </div>
//                                 </div>
//                                 <button type="button" onClick={(e) => handleDeleteClick(q.id, e)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }} title="מחק שלב">🗑️</button>
//                             </div>
//                         ))}
//                     </div>
//                     <button type="button" onClick={handleAddNewClick} style={{ marginTop: '20px', padding: '12px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
//                         ➕ יצירת שלב חדש
//                     </button>
//                 </div>

//                 {/* טופס עריכת השאלה */}
//                 <div style={{ flex: '3', border: '1px solid #d1d5db', padding: '25px', borderRadius: '8px', backgroundColor: '#fff', maxHeight: '80vh', overflowY: 'auto' }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//                         <h2 style={{ margin: 0, color: '#111827' }}>{selectedQuestionId ? '✏️ עריכת שלב קיים' : '✨ הוספת שלב חדש'}</h2>
//                         {isDirty && <span style={{ color: '#d97706', fontWeight: 'bold', fontSize: '14px' }}>* קיימים שינויים שלא נשמרו</span>}
//                     </div>

//                     <form onSubmit={handleSubmitQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
//                         <label style={{ fontWeight: 'bold', color: '#374151' }}>טקסט סיפור (העלילה שלפני החידה):</label>
//                         <textarea name="story_text" value={formData.story_text} onChange={handleInputChange} rows="3" placeholder="למשל: הדלת נפתחה והגעתם לחדר חשוך..." style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }} />

//                         <label style={{ fontWeight: 'bold', color: '#374151' }}>חידה / שאלה (*חובה):</label>
//                         <input type="text" name="question_text" value={formData.question_text} onChange={handleInputChange} required placeholder="למשל: מה הקוד למנעול?" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }} />

//                         <label style={{ fontWeight: 'bold', color: '#374151' }}>סוג החידה:</label>
//                         <select name="question_type" value={formData.question_type} onChange={handleInputChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }}>
//                             <option value="text">הזנת טקסט חופשי</option>
//                             <option value="multiple_choice">שאלת אמריקאית (בחירה מרובה)</option>
//                         </select>

//                         {formData.question_type === 'multiple_choice' && (
//                             <div style={{ padding: '15px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
//                                 <input type="text" name="option_a" value={formData.option_a} onChange={handleInputChange} placeholder="אפשרות א'" style={{ padding: '8px', border: '1px solid #93c5fd', borderRadius: '4px' }} />
//                                 <input type="text" name="option_b" value={formData.option_b} onChange={handleInputChange} placeholder="אפשרות ב'" style={{ padding: '8px', border: '1px solid #93c5fd', borderRadius: '4px' }} />
//                                 <input type="text" name="option_c" value={formData.option_c} onChange={handleInputChange} placeholder="אפשרות ג'" style={{ padding: '8px', border: '1px solid #93c5fd', borderRadius: '4px' }} />
//                                 <input type="text" name="option_d" value={formData.option_d} onChange={handleInputChange} placeholder="אפשרות ד'" style={{ padding: '8px', border: '1px solid #93c5fd', borderRadius: '4px' }} />
//                             </div>
//                         )}

//                         <label style={{ fontWeight: 'bold', color: '#374151' }}>תשובה נכונה (*חובה):</label>
//                         <input type="text" name="correct_answer" value={formData.correct_answer} onChange={handleInputChange} required placeholder="התשובה" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }} />

//                         <div style={{ display: 'flex', gap: '15px' }}>
//                             <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
//                                 <label style={{ fontWeight: 'bold', color: '#374151', marginBottom: '5px' }}>רמז (אופציונלי):</label>
//                                 <input type="text" name="hint_text" value={formData.hint_text} onChange={handleInputChange} placeholder="רמז לשחקנים..." style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }} />
//                             </div>
//                             <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
//                                 <label style={{ fontWeight: 'bold', color: '#374151', marginBottom: '5px' }}>הודעת הצלחה:</label>
//                                 <input type="text" name="success_message" value={formData.success_message} onChange={handleInputChange} placeholder="למשל: כל הכבוד!" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }} />
//                             </div>
//                         </div>

//                         <button type="submit" disabled={!isDirty} style={{ padding: '15px', background: isDirty ? '#10b981' : '#9ca3af', color: '#fff', border: 'none', borderRadius: '6px', cursor: isDirty ? 'pointer' : 'not-allowed', fontSize: '16px', fontWeight: 'bold', marginTop: '15px' }}>
//                             {selectedQuestionId ? '💾 שמור עדכונים לשלב זה' : '➕ שמור שלב חדש'}
//                         </button>
//                     </form>
//                 </div>

//                 {/* עמודה 3 - סיום החדר */}
//                 <div style={{ flex: '0.8', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
//                     <div style={{ border: '1px solid #d1d5db', padding: '20px', borderRadius: '8px', backgroundColor: '#fff' }}>
//                          <h3 style={{ marginTop: 0, color: '#4b5563', textAlign: 'center' }}>סיום עריכה</h3>
//                          <p style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center' }}>לאחר שסיימת להזין את כל חידות החדר, לחץ כאן.</p>
//                          <button type="button" onClick={handleFinishClick} style={{ padding: '15px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', width: '100%', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '20px' }}>
//                              סיום ושמירת החדר
//                          </button>
//                     </div>
//                 </div>
//             </div>

//             {/* מודאלים נקיים */}
//             {pendingSwitch && (
//                 <Modal title="⚠️ שינויים לא שמורים" titleColor="#d97706" message="האם לעזוב ללא שמירה?" confirmText="כן" confirmType="danger" onConfirm={() => executeSwitch(pendingSwitch)} cancelText="ביטול" onCancel={() => setPendingSwitch(null)} />
//             )}
//             {questionToDelete && (
//                 <Modal title="מחיקת שלב" message="בטוח שברצונך למחוק?" confirmText="כן, מחק!" confirmType="danger" onConfirm={executeDelete} cancelText="ביטול" onCancel={() => setQuestionToDelete(null)} />
//             )}
//             {showUnsavedModal && (
//                 <Modal title="⚠️ טופס לא שמור" titleColor="#d97706" message="לסיים את החדר למרות שלא שמרת את השאלה הנוכחית?" confirmText="סיים ללא שמירה" confirmType="danger" onConfirm={() => { setShowUnsavedModal(false); completeRoom(); }} cancelText="חזור לשמור" onCancel={() => setShowUnsavedModal(false)} />
//             )}
//             {showWarningModal && (
//                 <Modal title="מומלץ להוסיף חידות" titleColor="#3b82f6" message={`יצרת רק ${questions.length} שלבים. מומלץ לפחות 5.`} confirmText="סיום בכל זאת" confirmType="primary" onConfirm={completeRoom} cancelText="חזור להוסיף" onCancel={() => setShowWarningModal(false)} />
//             )}
//             {successMessage && (
//                 <Modal title="פעולה הושלמה" titleColor="#10b981" message={successMessage} confirmText="המשך" confirmType="success" onConfirm={() => { setSuccessMessage(''); if (successMessage.includes('נשמר בהצלחה')) navigate('/developer'); }} />
//             )}
//         </div>
//     );
// };

// export default ManageRoomQuestions;












// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { createQuestion, getQuestionsByRoom, updateQuestion, deleteQuestion } from '../api/questionApi';
// import { getAssets } from '../api/assetApi'; // ה-API החדש שיודע לעבוד עם עמודים
// import AssetGallery from '../components/AssetGallery/AssetGallery';
// // הייבוא של הכלים הנקיים שלנו!
// import Navbar from '../components/Navbar/Navbar';
// import Modal from '../components/Modal/Modal';
// import { useFetch } from '../hooks/useFetch';

// const EMPTY_FORM = {
//     story_text: '', question_text: '', question_type: 'text',
//     correct_answer: '', hint_text: '', success_message: '',
//     option_a: '', option_b: '', option_c: '', option_d: '',
//     selected_image: '', selected_audio: ''
// };

// const ManageRoomQuestions = () => {
//     const { roomId } = useParams();
//     const navigate = useNavigate();

//     // 1. שאיבת הנתונים הראשונית של שאלות החדר
//     const { data, loading, error } = useFetch(getQuestionsByRoom, roomId);
//     const [questions, setQuestions] = useState([]);
   
//     const [selectedQuestionId, setSelectedQuestionId] = useState(null);
//     const [formData, setFormData] = useState(EMPTY_FORM);
//     const [isDirty, setIsDirty] = useState(false);

//     // 2. סטייטים לניהול כל המודאלים (מחליפים את כל ה-alerts וה-confirms)
//     const [successMessage, setSuccessMessage] = useState('');
//     const [questionToDelete, setQuestionToDelete] = useState(null);
//     const [pendingSwitch, setPendingSwitch] = useState(null);
//     const [showWarningModal, setShowWarningModal] = useState(false);
//     const [showUnsavedModal, setShowUnsavedModal] = useState(false);

//     // --- 3. מערכת גלריית הנכסים המקצועית (Server-Side Pagination) ---
//     const [assetGallery, setAssetGallery] = useState({ show: false, type: '' });
//     const [assets, setAssets] = useState([]); // שומר את הפריטים שמשכנו מהשרת
//     const [currentPage, setCurrentPage] = useState(1); // העמוד הנוכחי שאנחנו בו
//     const [hasMoreAssets, setHasMoreAssets] = useState(true); // האם יש עוד פריטים בשרת?
//     const [isGalleryLoading, setIsGalleryLoading] = useState(false); // אנימציית טעינה לגלריה

//     // עדכון הסטייט המקומי ברגע שההוק מסיים להביא נתוני שאלות
//     useEffect(() => {
//         if (data && data.questions) {
//             setQuestions(data.questions);
//         }
//     }, [data]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//         setIsDirty(true);
//     };
   
//     // --- ניהול מעברים חכם עם מודאל במקום Confirm ---
//     const handleSelectQuestion = (q) => {
//         if (isDirty) {
//             setPendingSwitch(q);
//             return;
//         }
//         executeSwitch(q);
//     };

//     const handleAddNewClick = () => {
//         if (isDirty) {
//             setPendingSwitch('NEW');
//             return;
//         }
//         executeSwitch('NEW');
//     };

//     const executeSwitch = (target) => {
//         if (target === 'NEW') {
//             setSelectedQuestionId(null);
//             setFormData(EMPTY_FORM);
//         } else {
//             setSelectedQuestionId(target.id);
//             setFormData({
//                 story_text: target.story_text || '', question_text: target.question_text || '', question_type: target.question_type || 'text',
//                 correct_answer: target.correct_answer || '', hint_text: target.hint_text || '', success_message: target.success_message || '',
//                 option_a: target.option_a || '', option_b: target.option_b || '', option_c: target.option_c || '', option_d: target.option_d || '',
//                 selected_image: target.selected_image || '', selected_audio: target.selected_audio || ''
//             });
//         }
//         setIsDirty(false);
//         setPendingSwitch(null);
//     };

//     // --- פונקציות לניהול הגלריה שמדברות עם השרת ---

//     const openGallery = async (type) => {
//         setAssetGallery({ show: true, type: type });
//         setAssets([]); // מנקים גלריה קודמת
//         setCurrentPage(1);
//         setIsGalleryLoading(true);
       
//         try {
//             // מבקשים מהשרת את עמוד 1, 10 פריטים
//             const responseData = await getAssets(type, 1, 10);
//             if (responseData.success) {
//                 setAssets(responseData.assets);
//                 setHasMoreAssets(responseData.hasMore);
//             }
//         } catch (err) {
//             console.error("שגיאה במשיכת נכסים", err);
//         } finally {
//             setIsGalleryLoading(false);
//         }
//     };

//     const handleLoadMoreAssets = async () => {
//         const nextPage = currentPage + 1;
//         setIsGalleryLoading(true);
       
//         try {
//             // מבקשים מהשרת את העמוד הבא
//             const responseData = await getAssets(assetGallery.type, nextPage, 10);
//             if (responseData.success) {
//                 // לוקחים את הפריטים שכבר יש לנו, ומוסיפים להם את החדשים!
//                 setAssets(prevAssets => [...prevAssets, ...responseData.assets]);
//                 setCurrentPage(nextPage);
//                 setHasMoreAssets(responseData.hasMore);
//             }
//         } catch (err) {
//             console.error("שגיאה במשיכת נכסים נוספים", err);
//         } finally {
//             setIsGalleryLoading(false);
//         }
//     };

//     const closeGallery = () => {
//         setAssetGallery({ show: false, type: '' });
//         setAssets([]); // מנקים זיכרון כשסוגרים את הגלריה
//     };

//     const handleSelectAsset = (assetId) => {
//         if (assetGallery.type === 'image') {
//             setFormData({ ...formData, selected_image: assetId });
//         } else if (assetGallery.type === 'audio') {
//             setFormData({ ...formData, selected_audio: assetId });
//         }
//         setIsDirty(true);
//         closeGallery();
//     };

//     // --- שמירה ומחיקה (עדכון מקומי כדי לחסוך טעינות) ---
//     const handleSubmitQuestion = async (e) => {
//         e.preventDefault();
//         try {
//             if (selectedQuestionId) {
//                 const res = await updateQuestion(selectedQuestionId, formData);
//                 if (res && res.success) {
//                     setSuccessMessage('השלב עודכן בהצלחה! ✨');
//                     setIsDirty(false);
//                     setQuestions(questions.map(q => q.id === selectedQuestionId ? { ...q, ...formData } : q));
//                 }
//             } else {
//                 const newQuestionData = { ...formData, question_order: (questions?.length || 0) + 1 };
//                 const res = await createQuestion(roomId, newQuestionData);
//                 if (res && res.success) {
//                     setSuccessMessage('השלב החדש נוסף לחדר בהצלחה! 🚀');
//                     setIsDirty(false);
//                     setFormData(EMPTY_FORM);
//                     const freshData = await getQuestionsByRoom(roomId);
//                     if (freshData.success) setQuestions(freshData.questions);
//                 }
//             }
//         } catch (err) {
//             alert('שגיאה בשמירת השאלה.');
//         }
//     };

//     const handleDeleteClick = (id, e) => {
//         e.stopPropagation();
//         setQuestionToDelete(id);
//     };

//     const executeDelete = async () => {
//         try {
//             await deleteQuestion(questionToDelete);
//             setQuestions(questions.filter(q => q.id !== questionToDelete));
           
//             if (selectedQuestionId === questionToDelete) {
//                 setSelectedQuestionId(null);
//                 setFormData(EMPTY_FORM);
//                 setIsDirty(false);
//             }
//             setQuestionToDelete(null);
//             setSuccessMessage('השלב נמחק בהצלחה! 🗑️');
//         } catch (err) {
//             alert('שגיאה במחיקה.');
//         }
//     };

//     // --- סיום החדר ---
//     const handleFinishClick = () => {
//         if (isDirty && (formData.question_text !== '' || formData.story_text !== '')) {
//             setShowUnsavedModal(true);
//             return;
//         }
//         if ((questions?.length || 0) < 5) {
//             setShowWarningModal(true);
//             return;
//         }
//         completeRoom();
//     };

//     const completeRoom = () => {
//         setSuccessMessage('החדר נשמר ופורסם בהצלחה! 🏆');
//     };

//     if (loading) return <div style={{ textAlign: 'center', marginTop: '100px' }}>טוען את נתוני החדר... ⏳</div>;
//     if (error) return <div style={{ textAlign: 'center', color: 'red', marginTop: '100px' }}>{error}</div>;

//     return (
//         <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: 'Arial, sans-serif', direction: 'rtl' }}>
           
//             <Navbar />

//             <div style={{ display: 'flex', gap: '20px', padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
               
//                 {/* --- עמודה 1: רשימת החידות והשלבים --- */}
//                 <div style={{ flex: '1.2', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#fff', padding: '15px', display: 'flex', flexDirection: 'column', maxHeight: '80vh', overflowY: 'auto' }}>
//                     <h3 style={{ marginTop: 0, color: '#4b5563', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>
//                         שלבי החדר ({questions.length})
//                     </h3>
                   
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 }}>
//                         {questions.map((q, index) => {
//                             const isSelected = selectedQuestionId === q.id;
//                             return (
//                                 <div
//                                     key={q.id}
//                                     onClick={() => handleSelectQuestion(q)}
//                                     style={{ padding: '12px', border: isSelected ? '2px solid #8b5cf6' : '1px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer', backgroundColor: isSelected ? '#f5f3ff' : '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
//                                 >
//                                     <div>
//                                         <strong style={{ color: isSelected ? '#6d28d9' : '#111827' }}>שלב {index + 1}</strong>
//                                         <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
//                                             {q.question_text}
//                                         </div>
//                                     </div>
//                                     <button onClick={(e) => handleDeleteClick(q.id, e)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }} title="מחק שלב">
//                                         🗑️
//                                     </button>
//                                 </div>
//                             );
//                         })}
//                     </div>

//                     <button onClick={handleAddNewClick} style={{ marginTop: '20px', padding: '12px', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
//                         ➕ יצירת שלב חדש
//                     </button>
//                 </div>

//                 {/* --- עמודה 2: אזור העריכה המרכזי --- */}
//                 <div style={{ flex: '3', border: '1px solid #d1d5db', padding: '25px', borderRadius: '8px', backgroundColor: '#fff', maxHeight: '80vh', overflowY: 'auto' }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//                         <h2 style={{ margin: 0, color: '#111827' }}>
//                             {selectedQuestionId ? '✏️ עריכת שלב קיים' : '✨ הוספת שלב חדש לחדר'}
//                         </h2>
//                         {isDirty && <span style={{ color: '#d97706', fontWeight: 'bold', fontSize: '14px' }}>* קיימים שינויים שלא נשמרו</span>}
//                     </div>
                   
//                     <form onSubmit={handleSubmitQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                       
//                         {/* תצוגה של נכס שנבחר לשאלה */}
//                         {(formData.selected_image || formData.selected_audio) && (
//                             <div style={{ display: 'flex', gap: '10px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px', borderRadius: '6px' }}>
//                                 <strong>נכסים מקושרים לשלב:</strong>
//                                 {formData.selected_image && <span>🖼️ תמונה (ID: {formData.selected_image})</span>}
//                                 {formData.selected_audio && <span style={{ marginRight: '15px' }}>🎵 סאונד (ID: {formData.selected_audio})</span>}
//                             </div>
//                         )}

//                         <label style={{ fontWeight: 'bold', color: '#374151' }}>טקסט סיפור (העלילה שלפני החידה):</label>
//                         <textarea name="story_text" value={formData.story_text} onChange={handleInputChange} rows="3" placeholder="למשל: הדלת נפתחה והגעתם לחדר חשוך..." style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }} />

//                         <label style={{ fontWeight: 'bold', color: '#374151' }}>חידה / שאלה (*חובה):</label>
//                         <input type="text" name="question_text" value={formData.question_text} onChange={handleInputChange} required placeholder="למשל: מה הקוד למנעול?" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }} />

//                         <label style={{ fontWeight: 'bold', color: '#374151' }}>סוג החידה:</label>
//                         <select name="question_type" value={formData.question_type} onChange={handleInputChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }}>
//                             <option value="text">הזנת טקסט חופשי</option>
//                             <option value="multiple_choice">שאלת אמריקאית (בחירה מרובה)</option>
//                         </select>

//                         {formData.question_type === 'multiple_choice' && (
//                             <div style={{ padding: '15px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
//                                 <p style={{ margin: 0, fontWeight: 'bold', color: '#1e40af' }}>הזן את אפשרויות הבחירה לשחקן:</p>
//                                 <input type="text" name="option_a" value={formData.option_a} onChange={handleInputChange} placeholder="אפשרות א'" style={{ padding: '8px', border: '1px solid #93c5fd', borderRadius: '4px' }} />
//                                 <input type="text" name="option_b" value={formData.option_b} onChange={handleInputChange} placeholder="אפשרות ב'" style={{ padding: '8px', border: '1px solid #93c5fd', borderRadius: '4px' }} />
//                                 <input type="text" name="option_c" value={formData.option_c} onChange={handleInputChange} placeholder="אפשרות ג'" style={{ padding: '8px', border: '1px solid #93c5fd', borderRadius: '4px' }} />
//                                 <input type="text" name="option_d" value={formData.option_d} onChange={handleInputChange} placeholder="אפשרות ד'" style={{ padding: '8px', border: '1px solid #93c5fd', borderRadius: '4px' }} />
//                             </div>
//                         )}

//                         <label style={{ fontWeight: 'bold', color: '#374151' }}>תשובה נכונה (*חובה):</label>
//                         <input type="text" name="correct_answer" value={formData.correct_answer} onChange={handleInputChange} required placeholder="התשובה שתעביר את השחקן שלב" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }} />

//                         <div style={{ display: 'flex', gap: '15px' }}>
//                             <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
//                                 <label style={{ fontWeight: 'bold', color: '#374151', marginBottom: '5px' }}>רמז (אופציונלי):</label>
//                                 <input type="text" name="hint_text" value={formData.hint_text} onChange={handleInputChange} placeholder="רמז לשחקנים שנתקעו..." style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }} />
//                             </div>
//                             <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
//                                 <label style={{ fontWeight: 'bold', color: '#374151', marginBottom: '5px' }}>הודעת הצלחה:</label>
//                                 <input type="text" name="success_message" value={formData.success_message} onChange={handleInputChange} placeholder="למשל: כל הכבוד!" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb' }} />
//                             </div>
//                         </div>

//                         <button type="submit" disabled={!isDirty} style={{ padding: '15px', background: isDirty ? '#10b981' : '#9ca3af', color: '#fff', border: 'none', borderRadius: '6px', cursor: isDirty ? 'pointer' : 'not-allowed', fontSize: '16px', fontWeight: 'bold', marginTop: '15px', transition: '0.2s' }}>
//                             {selectedQuestionId ? '💾 שמור עדכונים לשלב זה' : '➕ שמור שלב חדש לחדר'}
//                         </button>
//                     </form>
//                 </div>

//                 {/* --- עמודה 3: אלמנטים וסיום החדר --- */}
//                 <div style={{ flex: '1', border: '1px solid #d1d5db', padding: '20px', borderRadius: '8px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
//                     <div>
//                         <h3 style={{ marginTop: 0, color: '#4b5563' }}>ניהול אלמנטים</h3>
//                         <p style={{ fontSize: '14px', color: '#6b7280' }}>הוספת רכיבים לחדר:</p>
                       
//                         <button type="button" style={{ width: '100%', padding: '12px', marginBottom: '10px', cursor: 'not-allowed', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', fontWeight: 'bold', color: '#9ca3af' }}>
//                             ⚙️ פופ-אפ מותאם (בקרוב)
//                         </button>
//                         {/* כפתורים הפותחים את הגלריה מהשרת */}
//                         <button type="button" onClick={() => openGallery('image')} style={{ width: '100%', padding: '12px', marginBottom: '10px', cursor: 'pointer', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', fontWeight: 'bold', color: '#1d4ed8' }}>
//                             🖼️ בחר תמונת רמז
//                         </button>
//                         <button type="button" onClick={() => openGallery('audio')} style={{ width: '100%', padding: '12px', marginBottom: '10px', cursor: 'pointer', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', fontWeight: 'bold', color: '#1d4ed8' }}>
//                             🎵 הוסף קובץ שמע
//                         </button>
//                     </div>

//                     <div style={{ marginTop: '30px' }}>
//                         <hr style={{ borderColor: '#e5e7eb', marginBottom: '20px' }} />
//                         <button onClick={handleFinishClick} style={{ padding: '15px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', width: '100%', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)' }}>
//                             סיום ושמירת החדר
//                         </button>
//                     </div>
//                 </div>
//             </div>

            
//             {/* --- חלון גלריית הנכסים החכמה --- */}
//             <AssetGallery 
//                 show={assetGallery.show}
//                 type={assetGallery.type}
//                 assets={assets}
//                 isGalleryLoading={isGalleryLoading}
//                 hasMoreAssets={hasMoreAssets}
//                 onClose={closeGallery}
//                 onSelectAsset={handleSelectAsset}
//                 onLoadMore={handleLoadMoreAssets}
//             />

//             {/* --- אזור המודאלים הגנריים --- */}
//             {pendingSwitch && (
//                 <Modal
//                     title="⚠️ שינויים לא שמורים"
//                     titleColor="#d97706"
//                     message="יש לך שינויים שלא שמרת בטופס הנוכחי. האם לעזוב ולמחוק את השינויים?"
//                     confirmText="כן, עזוב ללא שמירה"
//                     confirmType="danger"
//                     onConfirm={() => executeSwitch(pendingSwitch)}
//                     cancelText="חזור לשמור"
//                     onCancel={() => setPendingSwitch(null)}
//                 />
//             )}

//             {questionToDelete && (
//                 <Modal
//                     title="מחיקת שלב"
//                     message="האם אתה בטוח שברצונך למחוק שלב זה לצמיתות?"
//                     confirmText="כן, מחק!"
//                     confirmType="danger"
//                     onConfirm={executeDelete}
//                     cancelText="ביטול"
//                     onCancel={() => setQuestionToDelete(null)}
//                 />
//             )}

//             {showUnsavedModal && (
//                 <Modal
//                     title="⚠️ טופס לא שמור"
//                     titleColor="#d97706"
//                     message="התחלת לכתוב מידע בטופס אבל עדיין לא לחצת על שמור. לסיים את החדר בכל זאת?"
//                     confirmText="סיים ללא שמירה"
//                     confirmType="danger"
//                     onConfirm={() => { setShowUnsavedModal(false); completeRoom(); }}
//                     cancelText="חזור לשמור"
//                     onCancel={() => setShowUnsavedModal(false)}
//                 />
//             )}

//             {showWarningModal && (
//                 <Modal
//                     title="מומלץ להוסיף חידות"
//                     titleColor="#3b82f6"
//                     message={`שמנו לב שיצרת רק ${questions.length} שלבים. מומלץ ליצור לפחות 5 שלבים לחוויה מושלמת.`}
//                     confirmText="סיום ופרסום"
//                     confirmType="primary"
//                     onConfirm={completeRoom}
//                     cancelText="חזור להוסיף"
//                     onCancel={() => setShowWarningModal(false)}
//                 />
//             )}

//             {successMessage && (
//                 <Modal
//                     title="פעולה הושלמה"
//                     titleColor="#10b981"
//                     message={successMessage}
//                     confirmText="המשך"
//                     confirmType="success"
//                     onConfirm={() => {
//                         setSuccessMessage('');
//                         if (successMessage.includes('נשמר ופורסם')) navigate('/developer');
//                     }}
//                 />
//             )}

//         </div>
//     );
// };

// export default ManageRoomQuestions;












// --- חלון גלריית הנכסים החכמה ---
//             {assetGallery.show && (
//                 <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
//                     <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto' }}>
//                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//                             <h2 style={{ margin: 0 }}>{assetGallery.type === 'image' ? 'בחר תמונה מהמאגר' : 'בחר אפקט קולי מהמאגר'}</h2>
//                             <button onClick={closeGallery} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✖️</button>
//                         </div>
                       
//                         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px' }}>
//                             {assets.map(asset => (
//                                 <div
//                                     key={asset.id}
//                                     onClick={() => handleSelectAsset(asset.id)}
//                                     style={{ border: '2px solid #e5e7eb', borderRadius: '8px', padding: '15px', textAlign: 'center', cursor: 'pointer', transition: '0.2s' }}
//                                 >
//                                     {asset.type === 'image' ? (
//                                        <img src={`http://localhost:5000${asset.file_url}`} alt={asset.name} style={{ width: '100%', height: '80px', objectFit: 'contain' }} />
//                                     ) : (
//                                        <div style={{ fontSize: '40px' }}>🔊</div>
//                                     )}
//                                     <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', marginTop: '10px' }}>{asset.name}</div>
//                                 </div>
//                             ))}
//                         </div>
                       
//                         {/* חיווי טעינה כשהשרת חושב */}
//                         {isGalleryLoading && <div style={{ textAlign: 'center', marginTop: '20px', color: '#6b7280', fontWeight: 'bold' }}>טוען נתונים מהשרת... ⏳</div>}

//                         {/* מציג כפתור רק אם אין טעינה פעילה, וגם השרת אמר שנשארו עוד פריטים */}
//                         {!isGalleryLoading && hasMoreAssets && (
//                             <div style={{ marginTop: '20px', textAlign: 'center' }}>
//                                 <button onClick={handleLoadMoreAssets} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
//                                     👇 טען עוד אלמנטים מהשרת
//                                 </button>
//                             </div>
//                         )}
                       
//                         <div style={{ marginTop: '20px', textAlign: 'center' }}>
//                             <button onClick={() => handleSelectAsset('')} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}>
//                                 ללא נכס (נקה בחירה)
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
