import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import styles from './Navbar.module.css';

const Navbar = ({ showProfile = false }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.logoContainer}>
                <h2 className={styles.logo}>
                    {user?.role === 'developer' ? ' סטודיו מפתחים' : 'EscapeMaster'}
                </h2>
                
                {/* {showProfile && (
                    <button onClick={() => navigate('/profile')} className={styles.navButton}>
                        ספר שחקן 📜
                    </button>
                )} */}
            </div>
            
            <div className={styles.userSection}>
                <span className={styles.greeting}>
                    שלום, <b className={styles.username}>{user?.username}</b>
                </span>
                
                {user?.role === 'player' && (
                    <span className={styles.pointsBadge}>
                       הנקודות שלי: {user.points || 0} 🔮
                    </span>
                )}
                
                <button 
                    onClick={handleLogout} 
                    className={`${styles.navButton} ${styles.logoutButton}`}
                >
                    התנתקות 🗝️
                </button>
            </div>
        </nav>
    );
};

export default Navbar;







// import React, { useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../../context/AuthContext';

// import styles from './Navbar.module.css';

// // 1. הדיוק הראשון: מחקנו את המילה 'points' מהסוגריים. 
// // הנאב-באר כבר לא צריך שיגידו לו כמה נקודות יש, הוא יודע לבד!
// const Navbar = ({ showProfile = false }) => {
//     const { user, logout } = useContext(AuthContext);
//     const navigate = useNavigate();

//     const handleLogout = () => {
//         logout();
//         navigate('/login');
//     };

//     return (
//         <nav className={styles.navbar}>
//             <div className={styles.logoContainer}>
//                 <h2 className={styles.logo}>
//                     {user?.role === 'developer' ? '🛠️ סטודיו מפתחים' : 'EscapeMaster'}
//                 </h2>
                
//                 {showProfile && (
//                     <button onClick={() => navigate('/profile')} className={styles.navButton}>
//                         הפרופיל שלי 👤
//                     </button>
//                 )}
//             </div>
            
//             <div className={styles.userSection}>
//                 <span className={styles.greeting}>
//                     שלום, <b className={styles.username}>{user?.username}</b>
//                 </span>
                
//                 {/* 2. הדיוק השני והחשוב: 
//                     קודם כל בודקים שמי שמחובר הוא שחקן (כדי למפתחים לא סתם יופיעו נקודות).
//                     ואז שולפים את user.total_points (עם גיבוי של 0 למקרה שאין לו עדיין נקודות) 
//                 */}
//                 {user?.role === 'player' && (
//                     <span className={styles.pointsBadge}>
//                         נקודות: {user.total_points || 0} 💎
//                     </span>
//                 )}
                
//                 <button 
//                     onClick={handleLogout} 
//                     className={`${styles.navButton} ${styles.logoutButton}`}
//                 >
//                     התנתקות 🚪
//                 </button>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;
