import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoomById, updateRoom } from '../../api/roomApi';
import Navbar from '../../components/Navbar/Navbar';
import Modal from '../../components/Modal/Modal';
import RoomForm from '../../components/RoomForm/RoomForm';
import styles from './EditRoom.module.css'; // ייבוא ה-CSS המודולרי החדש

const EditRoom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();

    // 1. תיקון הסטייט ההתחלתי: הסרת קאבר והוספת אודיו
    const [formData, setFormData] = useState({
        title: '', description: '', timer_minutes: 15,
        difficulty_level: 1, min_points_required: 0,
        bg_image_id: 1, bg_audio_id: ''     
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [successModal, setSuccessModal] = useState({ show: false });

    // מביאים את נתוני החדר כשהעמוד עולה
    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                const data = await getRoomById(roomId);
                //מה זה אומר האיפ הזה?
                if (data && data.room) {
                    // 2. עדכון הנתונים שנמשכים מהשרת: הוספת האודיו שנשמר בעבר
                    setFormData({
                        title: data.room.title || '',
                        description: data.room.description || '',
                        timer_minutes: (data.room.timer_seconds || 900) / 60,
                        difficulty_level: data.room.difficulty_level || 1,
                        min_points_required: data.room.min_points_required || 0,
                        bg_image_id: data.room.bg_image_id || 1,
                        bg_audio_id: data.room.bg_audio_id || '' // מושכים את האודיו מהשרת!
                    });
                }
            } catch (err) {
                setError('שגיאה בטעינת נתוני החדר.');
            } finally {
                setPageLoading(false);
            }
        };
        fetchRoomData();
    }, [roomId]);
//מה הפונ עושה
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');

        try {
            // 3. התיקון בשליחה לשרת (כמו שעשינו ב-CreateRoom)
            const roomDataForServer = {
                ...formData,
                timer_seconds: formData.timer_minutes * 60,
                cover_image_id: formData.bg_image_id, // תמונה אחת משמשת גם לקאבר
                bg_audio_id: formData.bg_audio_id ? formData.bg_audio_id : null // שליחת האודיו
            };

            const data = await updateRoom(roomId, roomDataForServer);

            if (data.success) {
                setSuccessModal({ show: true });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'שגיאה בעדכון החדר.');
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) return <div className={styles.loadingState}>טוען נתונים... ⏳</div>;

    return (
        <div className={styles.pageContainer}>
            <Navbar />
            //מה זה
            <div className={styles.contentWrapper}>
                
                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}
                {/* אותו טופס גנרי, הפעם עם סימון עריכה */}
                <RoomForm 
                    formData={formData} 
                    handleChange={handleChange} 
                    handleSubmit={handleSubmit} 
                    loading={loading} 
                    isEdit={true} 
                />
            </div>

            {successModal.show && (
                <Modal 
                    title="עודכן בהצלחה" 
                    titleColor="#10b981" 
                    message="הגדרות החדר נשמרו בהצלחה!" 
                    confirmText="חזור ללוח הבקרה" 
                    confirmType="success" 
                    onConfirm={() => navigate('/developer')} 
                />
            )}
        </div>
    );
};

export default EditRoom;

