import React, { useState, useEffect } from 'react';
import { getRoomElements, createRoomElement, deleteRoomElement } from '../../api/roomElementApi';
// בהנחה שיש לך פונקציה ששולפת את ה-assets, נחליף את זה ב-API הקיים שלך:
// import { getAssets } from '../../api/assetApi'; 

export default function RoomElementsManager({ roomId }) {
    const [elements, setElements] = useState([]);
    const [assets, setAssets] = useState([]); // לשמירת תמונות מהמאגר
    const [loading, setLoading] = useState(true);
    
    // סטייט לטופס יצירה חדש
    const [buttonLabel, setButtonLabel] = useState('');
    const [elementType, setElementType] = useState('scroll'); 
    const [elementText, setElementText] = useState('');
    const [selectedAssetId, setSelectedAssetId] = useState('');

    // טעינת הנתונים
    useEffect(() => {
        if (!roomId) return;
        
        const loadData = async () => {
            try {
                // שליפת האלמנטים הקיימים בחדר באמצעות שכבת ה-API
                const elementsData = await getRoomElements(roomId);
                setElements(elementsData);

                // כאן תוכלי לקרוא ל-API של ה-assets הקיים שלך כדי למלא את הגלריה. דוגמה:
                // const assetsData = await getAssets();
                // setAssets(assetsData.filter(a => a.asset_type === 'image'));
                
                setLoading(false);
            } catch (err) {
                console.error("שגיאה בטעינת הרכיבים:", err);
                setLoading(false);
            }
        };

        loadData();
    }, [roomId]);

    // שמירת אלמנט חדש
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
            
            // רענון הרשימה לאחר הוספה
            const updatedData = await getRoomElements(roomId);
            setElements(updatedData);
            
            // איפוס שדות
            setButtonLabel('');
            setElementText('');
            setSelectedAssetId('');
            alert('האלמנט נוסף לחדר בהצלחה! 🎉');
        } catch (err) {
            alert('תקלה בשמירת האלמנט');
        }
    };

    // מחיקת אלמנט
    const handleDelete = async (id) => {
        if (!window.confirm('האם למחוק אלמנט זה מהחדר?')) return;
        try {
            await deleteRoomElement(id);
            setElements(elements.filter(el => el.id !== id));
        } catch (err) {
            alert('תקלה במחיקת האלמנט');
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '20px' }}>טוען אלמנטים... ⏳</div>;

    return (
        <div style={{ border: '1px solid #e5e7eb', padding: '24px', borderRadius: '12px', background: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#1f2937' }}>🛠️ ניהול אביזרים ופופ-אפים</h3>
            
            {/* רשימת האלמנטים הפעילים בחדר */}
            <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', color: '#4b5563', marginBottom: '10px' }}>אלמנטים פעילים במשחק:</h4>
                {elements.length === 0 ? (
                    <p style={{ color: '#9ca3af', fontSize: '13px', fontStyle: 'italic' }}>אין עדיין אלמנטים מיוחדים בחדר זה.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {elements.map(el => (
                            <div key={el.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                                <span style={{ fontSize: '14px' }}>
                                    {el.element_type === 'scroll' && '📜'}
                                    {el.element_type === 'image' && '🗺️'}
                                    {el.element_type === 'hourglass' && '⏳'}
                                    <strong style={{ marginRight: '6px' }}>{el.button_label}</strong>
                                </span>
                                <button onClick={() => handleDelete(el.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '13px' }}>✖ מחק</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <hr style={{ border: '0', borderTop: '1px solid #f3f4f6', margin: '20px 0' }} />

            {/* טופס הוספה חדש */}
            <form onSubmit={handleAddElement} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '14px', color: '#4b5563' }}>הוספת אלמנט חדש:</h4>
                
                <div>
                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', fontWeight: '500' }}>שם הכפתור לשחקן:</label>
                    <input 
                        type="text" 
                        value={buttonLabel} 
                        onChange={(e) => setButtonLabel(e.target.value)} 
                        placeholder="למשל: פתח מגילה סודית, בדוק מפה" 
                        required 
                        style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', fontWeight: '500' }}>סוג האלמנט שייפתח:</label>
                    <select 
                        value={elementType} 
                        onChange={(e) => setElementType(e.target.value)}
                        style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: '#fff' }}
                    >
                        <option value="scroll">📜 מגילה עתיקה (הזנת טקסט חופשי)</option>
                        <option value="image">🗺️ תמונה מוכנה / מפה מהמאגר</option>
                        <option value="hourglass">⏳ שעון חול (סנכרון דינמי לטיימר)</option>
                    </select>
                </div>

                {/* שדה טקסט דינמי למגילה */}
                {elementType === 'scroll' && (
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', fontWeight: '500' }}>תוכן המגילה:</label>
                        <textarea 
                            value={elementText} 
                            onChange={(e) => setElementText(e.target.value)} 
                            placeholder="הקלידו את הסיפור או הרמז שיוצג על גבי הקלף..."
                            rows="3"
                            required
                            style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', fontFamily: 'inherit' }}
                        />
                    </div>
                )}

                {/* בחירת קובץ מהמאגר עבור תמונה */}
                {elementType === 'image' && (
                    <div>
                        <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', fontWeight: '500' }}>בחר קובץ מהמאגר:</label>
                        <select 
                            value={selectedAssetId} 
                            onChange={(e) => setSelectedAssetId(e.target.value)} 
                            required
                            style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: '#fff' }}
                        >
                            <option value="">-- בחר תמונה --</option>
                            {assets.map(asset => (
                                <option key={asset.id} value={asset.id}>{asset.name}</option>
                            ))}
                        </select>
                    </div>
                )}

                {elementType === 'hourglass' && (
                    <p style={{ fontSize: '12px', color: '#6b7280', fontStyle: 'italic', margin: '0' }}>
                        💡 אין צורך בקובץ או טקסט. המערכת תציג שעון חול אינטראקטיבי שמסונכרן עם הזמן שנותר לחדר.
                    </p>
                )}

                <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }}>
                    + הוסף אלמנט לחדר
                </button>
            </form>
        </div>
    );
}