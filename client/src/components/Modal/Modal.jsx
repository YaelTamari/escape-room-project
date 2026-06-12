import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ 
    title, 
    message, 
    onConfirm, 
    onCancel, 
    confirmText = "אישור", 
    cancelText = "ביטול", 
    confirmType = "primary", // יכול להיות: primary, danger, success
    titleColor = "#111827" 
}) => {
    
    // בוחרים את המחלקה (CSS) המתאימה לסוג הכפתור שביקשנו
    const confirmClass = confirmType === 'danger' ? styles.dangerBtn 
                       : confirmType === 'success' ? styles.successBtn 
                       : styles.primaryBtn;

    return (
        <div className={styles.overlay}>
            <div className={styles.modalBox}>
                <h3 className={styles.title} style={{ color: titleColor }}>{title}</h3>
                <p className={styles.message}>{message}</p>
                
                <div className={styles.buttonGroup}>
                    {/* כפתור אישור / פעולה עיקרית */}
                    <button onClick={onConfirm} className={`${styles.btn} ${confirmClass}`}>
                        {confirmText}
                    </button>

                    {/* כפתור ביטול (יוצג רק אם העבירו לו פונקציית ביטול) */}
                    {onCancel && (
                        <button onClick={onCancel} className={`${styles.btn} ${styles.cancelBtn}`}>
                            {cancelText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;