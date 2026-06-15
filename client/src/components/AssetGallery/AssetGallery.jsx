import React from 'react';
import styles from './AssetGallery.module.css'; // ייבוא העיצוב המודולרי!

const AssetGallery = ({ 
    show, 
    type, 
    assets, 
    isGalleryLoading, 
    hasMoreAssets, 
    onClose, 
    onSelectAsset, 
    onLoadMore 
}) => {
    // אם לא אמורים להציג את הגלריה, אל תצייר כלום
    if (!show) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                
                <div className={styles.header}>
                    <h2>{type === 'image' ? 'בחר תמונה מהמאגר' : 'בחר אפקט קולי מהמאגר'}</h2>
                    <button onClick={onClose} className={styles.closeBtn}>✖️</button>
                </div>
                
                <div className={styles.grid}>
                    {assets.map(asset => (
                        <div 
                            key={asset.id} 
                            onClick={() => onSelectAsset(asset.id)}
                            className={styles.assetCard}
                        >
                            {type === 'image' ? (
                               <img src={`http://localhost:5000${asset.file_url}`} alt={asset.name} className={styles.assetImage} />
                            ) : (
                               <div className={styles.assetIcon}>🔊</div>
                            )}
                            <div className={styles.assetName}>{asset.name}</div>
                        </div>
                    ))}
                </div>
                
                {isGalleryLoading && (
                    <div className={styles.loading}>טוען נתונים מהשרת... ⏳</div>
                )}

                {!isGalleryLoading && hasMoreAssets && (
                    <div className={styles.actionContainer}>
                        <button onClick={onLoadMore} className={styles.loadMoreBtn}>
                            👇 טען עוד אלמנטים
                        </button>
                    </div>
                )}
                
                <div className={styles.actionContainer}>
                    <button onClick={() => onSelectAsset('')} className={styles.clearBtn}>
                        ללא נכס (נקה בחירה)
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AssetGallery;