
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/authApi';
import { AuthContext } from '../context/AuthContext';

// הייבוא של המודאל שלנו
import Modal from '../components/Modal';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const { authenticate } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setError(''); 

        try {
            const data = await loginUser(username, password);
            
            if (data.success) {
                authenticate(data.user, data.token);

                if (data.user.role === 'developer') {
                    navigate('/developer'); 
                } else {
                    navigate('/lobby'); 
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'אירעה שגיאה בהתחברות. אנא נסה שוב.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <h2>התחברות למערכת</h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                <input
                    type="text"
                    placeholder="שם משתמש"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{ padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
                <input
                    type="password"
                    placeholder="סיסמה"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
                <button type="submit" style={{ padding: '10px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
                    היכנס
                </button>
            </form>
            
            <p style={{ marginTop: '20px' }}>
                עדיין אין לך משתמש? <Link to="/register" style={{ color: '#008CBA', fontWeight: 'bold' }}>הירשם כאן</Link>
            </p>

            {/* מודאל השגיאה מחליף את הטקסט האדום הפשוט! */}
            {error && (
                <Modal 
                    title="שגיאה בהתחברות"
                    titleColor="#ef4444"
                    message={error}
                    confirmText="סגור ונסה שוב"
                    confirmType="danger"
                    onConfirm={() => setError('')} 
                />
            )}
        </div>
    );
};

export default Login;






// import React, { useState, useContext } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { loginUser } from '../api/authApi';
// import { AuthContext } from '../context/AuthContext';

// const Login = () => {
//     // שמירת הנתונים שהמשתמש מקליד
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
    
//     // משיכת הפונקציה login מתוך ה-Context שלנו
//     const { authenticate } = useContext(AuthContext);
    
//     // כלי הניווט של React Router
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault(); // מונע מהדף להתרענן
//         setError(''); // איפוס שגיאות קודמות

//         try {
//             // 1. קריאה לשרת (מתוך הקובץ authApi שיצרנו)
//             const data = await loginUser(username, password);
            
//             if (data.success) {
//                 // 2. עדכון ה-Context והלוקל סטורג' (השרת שלך מחזיר user ו-token)
//                 authenticate(data.user, data.token);

//                 // 3. הניתוב החכם! לאן הולכים עכשיו?
//                 if (data.user.role === 'developer') {
//                     navigate('/developer'); // מפתחים הולכים לדאשבורד
//                 } else {
//                     navigate('/lobby'); // שחקנים הולכים ללובי החדרים
//                 }
//             }
//         } catch (err) {
//             // תפיסת שגיאות (כמו "סיסמה שגויה" שמגיעה מהשרת שלך)
//             setError(err.response?.data?.message || 'אירעה שגיאה בהתחברות');
//         }
//     };

//     return (
//         <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
//             <h2>התחברות למערכת</h2>
//             {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
            
//             <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
//                 <input
//                     type="text"
//                     placeholder="שם משתמש"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     required
//                     style={{ padding: '10px', fontSize: '16px' }}
//                 />
//                 <input
//                     type="password"
//                     placeholder="סיסמה"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     style={{ padding: '10px', fontSize: '16px' }}
//                 />
//                 <button type="submit" style={{ padding: '10px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
//                     היכנס
//                 </button>
//             </form>
            
//             <p style={{ marginTop: '20px' }}>
//                 עדיין אין לך משתמש? <Link to="/register">הירשם כאן</Link>
//             </p>
//         </div>
//     );
// };

// export default Login;