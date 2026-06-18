import React, { useContext, useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { registerUser } from '../../api/authApi';
import { AuthContext } from '../../context/AuthContext';
import Modal from '../../components/Modal/Modal';
import styles from './Register.module.css'; // הייבוא של ה-CSS החדש

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('player');
   
    const [error, setError] = useState('');
    const [successRole, setSuccessRole] = useState(null);

    const { authenticate, user } = useContext(AuthContext);
    const navigate = useNavigate();

    // חסימת גישה למי שכבר מחובר
    if (user) {
        return <Navigate to={user.role === 'developer' ? '/developer' : '/lobby'} replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const data = await registerUser(username, password, role);
            if (data.success) {
                authenticate(data.user, data.token);
                setSuccessRole(data.user.role);
            } else {
                setError(data.message || data.error || 'שגיאה בהרשמה.');
            }
        } catch (err) {
            const serverMsg = err.response?.data?.message || err.message;
            setError(serverMsg || 'אירעה שגיאה בהרשמה. אנא נסה שוב.');
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.authBox}>
                <h2 className={styles.title}>הרשמה למערכת</h2>
                
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
                        הצטרף עכשיו 🚀
                    </button>
                </form>
                
                <p className={styles.footerText}>
                    כבר יש לך משתמש? <Link to="/login" className={styles.link}>התחבר כאן</Link>
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
        </div>
    );
};

export default Register;











// import React, { useContext, useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { registerUser } from '../../api/authApi';
// import { AuthContext } from '../../context/AuthContext';
// import Modal from '../../components/Modal/Modal';
// import styles from './Register.module.css'; // ייבוא ה-CSS המופרד

// const Register = () => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [role, setRole] = useState('player');
   
//     const [error, setError] = useState('');
//     const [successRole, setSuccessRole] = useState(null);

//     const { authenticate } = useContext(AuthContext);
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
       
//         try {
//             const data = await registerUser(username, password, role);
//             if (data.success) {
//                 authenticate(data.user, data.token);
//                 setSuccessRole(data.user.role);
//             }
//             else {
//                 // תופס שגיאה שהגיעה מסודר (למשל: משתמש כבר קיים / רק מנהלות מורשות)
//                 setError(data.message || data.error || 'שגיאה בהרשמה.');
//             }
//         } catch (err) {
//             // תופס שגיאה של נפילת שרת או שגיאת רשת
//             const serverMsg = err.response?.data?.message || err.message;
//             setError(serverMsg || 'אירעה שגיאה בהרשמה. אנא נסה שוב.');
//         }
//     };

//     return (
//         <div className={styles.authContainer}>
//             <h2>הרשמה למערכת</h2>
           
//             <form onSubmit={handleSubmit} className={styles.form}>
//                 <input
//                     type="text"
//                     placeholder="בחר שם משתמש"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     required
//                     className={styles.inputField}
//                 />
//                 <input
//                     type="password"
//                     placeholder="בחר סיסמה"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     className={styles.inputField}
//                 />
               
//                 <div className={styles.roleWrapper}>
//                     <label className={styles.roleLabel}>סוג משתמש:</label>
//                     <select
//                         value={role}
//                         onChange={(e) => setRole(e.target.value)}
//                         className={styles.selectField}
//                     >
//                         <option value="player">שחקן (רוצה לפתור חדרים)</option>
//                         <option value="developer">מפתח (רוצה ליצור חדרים)</option>
//                     </select>
//                 </div>

//                 <button type="submit" className={styles.submitButton}>
//                     הירשם
//                 </button>
//             </form>
           
//             <p className={styles.footerText}>
//                 כבר יש לך משתמש? <Link to="/login" className={styles.loginLink}>התחבר כאן</Link>
//             </p>

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

