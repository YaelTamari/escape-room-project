
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

// הייבוא החכם של עיצוב מודולרי
import styles from './Navbar.module.css';

const Navbar = ({ points, showProfile = false }) => {
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
                    {user?.role === 'developer' ? '🛠️ סטודיו מפתחים' : 'EscapeMaster'}
                </h2>
                
                {showProfile && (
                    <button onClick={() => navigate('/profile')} className={styles.navButton}>
                        הפרופיל שלי 👤
                    </button>
                )}
            </div>
            
            <div className={styles.userSection}>
                <span className={styles.greeting}>
                    שלום, <b className={styles.username}>{user?.username}</b>
                </span>
                
                {points !== undefined && (
                    <span className={styles.pointsBadge}>
                        נקודות: {points} 💎
                    </span>
                )}
                
                {/* כאן שילבנו שתי מחלקות CSS יחד - גם כפתור רגיל וגם צבע יציאה */}
                <button 
                    onClick={handleLogout} 
                    className={`${styles.navButton} ${styles.logoutButton}`}
                >
                    התנתקות 🚪
                </button>
            </div>
        </nav>
    );
};

export default Navbar;