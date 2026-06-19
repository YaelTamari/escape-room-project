import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ 
    title, 
    message, 
    onConfirm, 
    onCancel, 
    confirmText = "אישור", 
    cancelText = "ביטול", 
    confirmType = "primary", // primary, danger, success
    showCancel = false,
    titleColor = "#111827" 
}) => {
    const isScroll = confirmType === 'scroll';
    const confirmClass = confirmType === 'danger' ? styles.dangerBtn 
                       : confirmType === 'success' ? styles.successBtn 
                       : confirmType === 'scroll' ? styles.scrollCloseBtn
                       : styles.primaryBtn;

   return (
        <div className={styles.overlay}>
            {/* אם זו מגילה, נוסיף מחלקה מיוחדת שמבטלת את הרקע והמסגרת לחלוטין */}
            <div className={`${styles.modalBox} ${isScroll ? styles.scrollBox : ''}`}>
                
                {/* מציגים את הכותרת הכללית רק אם זו לא מגילה */}
                {!isScroll && title && (
                    <h3 className={styles.title} style={{ color: titleColor || '#dfb76c' }}>
                        {title}
                    </h3>
                )}
                
                <div className={styles.message}>{message}</div>

                <div className={styles.buttonGroup}>
                    <button onClick={onConfirm} className={`${styles.btn} ${confirmClass}`}>
                        {isScroll ? "סגור מגילה 📜" : confirmText}
                    </button>

                    {/* כפתור ביטול - יוצג אך ורק אם showCancel הוא true */}
                    {showCancel && (
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