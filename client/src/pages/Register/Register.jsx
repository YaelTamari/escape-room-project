import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../api/authApi';
import { AuthContext } from '../../context/AuthContext';
import Modal from '../../components/Modal/Modal';
import styles from './Register.module.css'; // ייבוא ה-CSS המופרד

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('player');
   
    const [error, setError] = useState('');
    const [successRole, setSuccessRole] = useState(null);

    const { authenticate } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
       
        try {
            const data = await registerUser(username, password, role);
            if (data.success) {
                authenticate(data.user, data.token);
                setSuccessRole(data.user.role);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'אירעה שגיאה בהרשמה. אנא נסה שוב.');
        }
    };

    return (
        <div className={styles.authContainer}>
            <h2>הרשמה למערכת</h2>
           
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    placeholder="בחר שם משתמש"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className={styles.inputField}
                />
                <input
                    type="password"
                    placeholder="בחר סיסמה"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={styles.inputField}
                />
               
                <div className={styles.roleWrapper}>
                    <label className={styles.roleLabel}>סוג משתמש:</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className={styles.selectField}
                    >
                        <option value="player">שחקן (רוצה לפתור חדרים)</option>
                        <option value="developer">מפתח (רוצה ליצור חדרים)</option>
                    </select>
                </div>

                <button type="submit" className={styles.submitButton}>
                    הירשם
                </button>
            </form>
           
            <p className={styles.footerText}>
                כבר יש לך משתמש? <Link to="/login" className={styles.loginLink}>התחבר כאן</Link>
            </p>

            {error && (
                <Modal
                    title="שגיאה בהרשמה"
                    titleColor="#ef4444"
                    message={error}
                    confirmText="סגור"
                    confirmType="danger"
                    onConfirm={() => setError('')}
                />
            )}

            {successRole && (
                <Modal
                    title="הרשמה הושלמה!"
                    titleColor="#10b981"
                    message="איזה כיף שהצטרפת אלינו. החשבון שלך נוצר בהצלחה!"
                    confirmText="בוא נתחיל 🚀"
                    confirmType="success"
                    onConfirm={() => {
                        if (successRole === 'developer') {
                            navigate('/developer');
                        } else {
                            navigate('/lobby');
                        }
                    }}
                />
            )}
        </div>
    );
};

export default Register;











// import React, { useContext, useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { registerUser } from '../api/authApi';
// import { AuthContext } from '../context/AuthContext';

// // הייבוא של המודאל שלנו
// import Modal from '../components/Modal/Modal';

// const Register = () => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [role, setRole] = useState('player');
   
//     // סטייטים למודאלים
//     const [error, setError] = useState('');
//     const [successRole, setSuccessRole] = useState(null); // נשמור את תפקיד המשתמש כדי לדעת לאן לנווט בסוף

//     const { authenticate } = useContext(AuthContext);
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
       
//         try {
//             const data = await registerUser(username, password, role);
//             if (data.success) {
//                 // שומרים את המשתמש
//                 authenticate(data.user, data.token);
//                 // במקום לנווט מיד, מדליקים את מודאל ההצלחה ושומרים את התפקיד
//                 setSuccessRole(data.user.role);
//             }
//         } catch (err) {
//             setError(err.response?.data?.message || 'אירעה שגיאה בהרשמה. אנא נסה שוב.');
//         }
//     };

//     return (
//         <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
//             <h2>הרשמה למערכת</h2>
           
//             <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
//                 <input
//                     type="text"
//                     placeholder="בחר שם משתמש"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     required
//                     style={{ padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc' }}
//                 />
//                 <input
//                     type="password"
//                     placeholder="בחר סיסמה"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     style={{ padding: '10px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc' }}
//                 />
               
//                 <div style={{ textAlign: 'right', padding: '0 5px' }}>
//                     <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>סוג משתמש:</label>
//                     <select
//                         value={role}
//                         onChange={(e) => setRole(e.target.value)}
//                         style={{ padding: '10px', fontSize: '16px', width: '100%', borderRadius: '6px', border: '1px solid #ccc' }}
//                     >
//                         <option value="player">שחקן (רוצה לפתור חדרים)</option>
//                         <option value="developer">מפתח (רוצה ליצור חדרים)</option>
//                     </select>
//                 </div>

//                 <button type="submit" style={{ padding: '10px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#008CBA', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
//                     הירשם
//                 </button>
//             </form>
           
//             <p style={{ marginTop: '20px' }}>
//                 כבר יש לך משתמש? <Link to="/login" style={{ color: '#4CAF50', fontWeight: 'bold' }}>התחבר כאן</Link>
//             </p>

//             {/* מודאל השגיאה */}
//             {error && (
//                 <Modal
//                     title="שגיאה בהרשמה"
//                     titleColor="#ef4444"
//                     message={error}
//                     confirmText="סגור"
//                     confirmType="danger"
//                     onConfirm={() => setError('')}
//                 />
//             )}

//             {/* מודאל ההצלחה שמנווט רק אחרי לחיצה! */}
//             {successRole && (
//                 <Modal
//                     title="הרשמה הושלמה!"
//                     titleColor="#10b981"
//                     message="איזה כיף שהצטרפת אלינו. החשבון שלך נוצר בהצלחה!"
//                     confirmText="בוא נתחיל 🚀"
//                     confirmType="success"
//                     onConfirm={() => {
//                         if (successRole === 'developer') {
//                             navigate('/developer');
//                         } else {
//                             navigate('/lobby');
//                         }
//                     }}
//                 />
//             )}
//         </div>
//     );
// };

// export default Register;