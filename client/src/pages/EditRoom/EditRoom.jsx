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

    const [formData, setFormData] = useState({
        title: '', description: '', timer_minutes: 15,
        difficulty_level: 1, min_points_required: 0,
        cover_image_id: 1, bg_image_id: 1     
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
                if (data && data.room) {
                    setFormData({
                        title: data.room.title || '',
                        description: data.room.description || '',
                        timer_minutes: (data.room.timer_seconds || 900) / 60,
                        difficulty_level: data.room.difficulty_level || 1,
                        min_points_required: data.room.min_points_required || 0,
                        cover_image_id: data.room.cover_image_id || 1,
                        bg_image_id: data.room.bg_image_id || 1
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError('');

        try {
            const roomDataForServer = {
                ...formData,
                timer_seconds: formData.timer_minutes * 60,
                bg_audio_id: null
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