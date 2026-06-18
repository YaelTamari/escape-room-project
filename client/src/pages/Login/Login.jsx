import React, { useState, useContext } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { loginUser } from '../../api/authApi';
import { AuthContext } from '../../context/AuthContext';
import Modal from '../../components/Modal/Modal';
import styles from './Login.module.css'; // הייבוא של ה-CSS החדש

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const { authenticate, user } = useContext(AuthContext);
    const navigate = useNavigate();

    if (user) {
        return <Navigate to={user.role === 'developer' ? '/developer' : '/lobby'} replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setError(''); 

        try {
            const data = await loginUser(username, password);
            
            if (data.success) {
                authenticate(data.user, data.token);

                if (data.user.role === 'developer') {
                    navigate('/developer', { replace: true }); 
                } else {
                    navigate('/lobby', { replace: true }); 
                }
            } else {
                setError(data.message || data.error || 'שם משתמש או סיסמה שגויים.');
            }
        } catch (err) {
            const serverMsg = err.response?.data?.message || err.message;
            setError(serverMsg || 'אירעה שגיאה בהתחברות. אנא נסה שוב.');
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.authBox}>
                <h2 className={styles.title}>התחברות למערכת</h2>
                
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="text"
                        placeholder="שם משתמש"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className={styles.inputField}
                    />
                    <input
                        type="password"
                        placeholder="סיסמה"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.inputField}
                    />
                    <button type="submit" className={styles.submitButton}>
                        היכנס 🗝️
                    </button>
                </form>
                
                <p className={styles.footerText}>
                    עדיין אין לך משתמש? <Link to="/register" className={styles.link}>הירשם כאן</Link>
                </p>

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
        </div>
    );
};

export default Login;












// import React, { useState, useContext } from 'react';
// import { useNavigate, Link, Navigate } from 'react-router-dom';
// import { loginUser } from '../../api/authApi';
// import { AuthContext } from '../../context/AuthContext';
// import Modal from '../../components/Modal/Modal';
// import styles from './Login.module.css'; // ייבוא ה-CSS המופרד

// const Login = () => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
    
//     const { authenticate, user } = useContext(AuthContext);
//     const navigate = useNavigate();

//     if (user) {
//         return <Navigate to={user.role === 'developer' ? '/developer' : '/lobby'} replace />;
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault(); 
//         setError(''); 

//         try {
//             const data = await loginUser(username, password);
            
//             if (data.success) {
//                 authenticate(data.user, data.token);

//                 if (data.user.role === 'developer') {
//                     navigate('/developer', { replace: true }); 
//                 } else {
//                     navigate('/lobby', { replace: true }); 
//                 }
//             }
//             else {
//                 // תופס שגיאה שהגיעה מסודר מהשרת (למשל: סיסמה שגויה)
//                 setError(data.message || data.error || 'שם משתמש או סיסמה שגויים.');
//             }
        
//         } catch (err) {
//             // תופס שגיאה של נפילת שרת או חוסר תקשורת
//             const serverMsg = err.response?.data?.message || err.message;
//             setError(serverMsg || 'אירעה שגיאה בהתחברות. אנא נסה שוב.');
//         }
//     };

//     return (
//         <div className={styles.authContainer}>
//             <h2>התחברות למערכת</h2>
            
//             <form onSubmit={handleSubmit} className={styles.form}>
//                 <input
//                     type="text"
//                     placeholder="שם משתמש"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     required
//                     className={styles.inputField}
//                 />
//                 <input
//                     type="password"
//                     placeholder="סיסמה"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     className={styles.inputField}
//                 />
//                 <button type="submit" className={styles.submitButton}>
//                     היכנס
//                 </button>
//             </form>
            
//             <p className={styles.footerText}>
//                 עדיין אין לך משתמש? <Link to="/register" className={styles.registerLink}>הירשם כאן</Link>
//             </p>

//             {error && (
//                 <Modal 
//                     title="שגיאה בהתחברות"
//                     titleColor="#ef4444"
//                     message={error}
//                     confirmText="סגור ונסה שוב"
//                     confirmType="danger"
//                     onConfirm={() => setError('')} 
//                 />
//             )}
//         </div>
//     );
// };

// export default Login;