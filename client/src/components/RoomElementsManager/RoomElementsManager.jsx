import React, { useState, useEffect } from 'react';
import { getRoomElements, createRoomElement, deleteRoomElement } from '../../api/roomElementApi';
import './RoomElementsManager.css';

export default function RoomElementsManager({ roomId }) {
    const [elements, setElements] = useState([]);
    const [assets, setAssets] = useState([]); 
    const [loading, setLoading] = useState(true);    
    const [buttonLabel, setButtonLabel] = useState('');
    const [elementType, setElementType] = useState('scroll'); 
    const [elementText, setElementText] = useState('');
    const [selectedAssetId, setSelectedAssetId] = useState('');

    useEffect(() => {
        if (!roomId) return;
        
        const loadRoomData = async () => {
            try {
                const elementsData = await getRoomElements(roomId);
                setElements(elementsData);
                setLoading(false);
            } catch (err) {
                console.error("שגיאה בטעינת הרכיבים:", err);
                setLoading(false);
            }
        };

        loadRoomData();
    }, [roomId]);

    useEffect(() => {
        if (elementType === 'image') {
            fetch('http://localhost:5000/api/assets?type=popup')
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.assets) {
                        setAssets(data.assets);
                    }
                })
                .catch(err => console.error("שגיאה בטעינת המאגר:", err));
        }
    }, [elementType]);

    const handleAddElement = async (e) => {
        e.preventDefault();
        
        const payload = {
            element_type: elementType,
            button_label: buttonLabel,
            element_text: elementType === 'scroll' ? elementText : null,
            asset_id: elementType === 'image' ? selectedAssetId : null
        };

        try {
            await createRoomElement(roomId, payload);
            
            const updatedData = await getRoomElements(roomId);
            setElements(updatedData);
            
            setButtonLabel('');
            setElementText('');
            setSelectedAssetId('');
            alert('האלמנט נוסף לחדר בהצלחה! 🎉');
        } catch (err) {
            alert('תקלה בשמירת האלמנט');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('האם למחוק אלמנט זה מהחדר?')) return;
        try {
            await deleteRoomElement(id);
            setElements(elements.filter(el => el.id !== id));
        } catch (err) {
            alert('תקלה במחיקת האלמנט');
        }
    };

    if (loading) return <div className="loading-state">טוען אלמנטים... ⏳</div>;

    return (
        <div className="elements-manager-card">
            <h3 className="manager-title">🛠️ ניהול אביזרים ופופ-אפים</h3>
            
            <div className="active-elements-section">
                <h4 className="section-subtitle">אלמנטים פעילים במשחק:</h4>
                {elements.length === 0 ? (
                    <p className="empty-state">אין עדיין אלמנטים מיוחדים בחדר זה.</p>
                ) : (
                    <div className="elements-list">
                        {elements.map(el => (
                            <div key={el.id} className="element-item">
                                <span className="element-info">
                                    {el.element_type === 'scroll' && '📜 '}
                                    {el.element_type === 'image' && '🗺️ '}
                                    <strong className="element-label">{el.button_label}</strong>
                                </span>
                                <button onClick={() => handleDelete(el.id)} className="element-delete-btn">
                                    ✖ מחק
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <hr className="manager-divider" />

            <form onSubmit={handleAddElement} className="add-element-form">
                <h4 className="section-subtitle">הוספת אלמנט חדש:</h4>
                
                <div className="form-group">
                    <label className="form-label">שם הכפתור לשחקן:</label>
                    <input 
                        type="text" 
                        value={buttonLabel} 
                        onChange={(e) => setButtonLabel(e.target.value)} 
                        placeholder="למשל: פתח מגילה סודית, בדוק מפה" 
                        required 
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">סוג האלמנט שייפתח:</label>
                    <select 
                        value={elementType} 
                        onChange={(e) => setElementType(e.target.value)}
                        className="form-select"
                    >
                        <option value="scroll">📜 מגילה עתיקה (הזנת טקסט חופשי)</option>
                        <option value="image">🗺️ תמונה מוכנה / מפה מהמאגר</option>
                    </select>
                </div>

                {elementType === 'scroll' && (
                    <div className="form-group">
                        <label className="form-label">תוכן המגילה:</label>
                        <textarea 
                            value={elementText} 
                            onChange={(e) => setElementText(e.target.value)} 
                            placeholder="הקלידו את הסיפור או הרמז שיוצג על גבי הקלף..."
                            required
                            className="form-textarea"
                        />
                    </div>
                )}

                {elementType === 'image' && (
                    <div className="form-group">
                        <label className="form-label">בחר קובץ מהמאגר:</label>
                        <select 
                            value={selectedAssetId} 
                            onChange={(e) => setSelectedAssetId(e.target.value)} 
                            required
                            className="form-select"
                        >
                            <option value="">-- בחר תמונה --</option>
                            {assets.map(asset => (
                                <option key={asset.id} value={asset.id}>{asset.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                

                <button type="submit" className="submit-btn">
                    + הוסף אלמנט לחדר
                </button>
            </form>
        </div>
    );
}
