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

                <div className={styles.logoutWrapper}>
                    <button onClick={handleLogout} className={`${styles.navButton} ${styles.logoutButton}`}>
                        התנתקות 🗝️
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
