import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '../../api/roomApi';
import Navbar from '../../components/Navbar/Navbar';
import Modal from '../../components/Modal/Modal';
import RoomForm from '../../components/RoomForm/RoomForm'; // הטופס הגנרי המעולה שלך
import styles from './CreateRoom.module.css'; // ייבוא ה-CSS המודולרי החדש

const CreateRoom = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '', description: '', timer_minutes: 15,
        difficulty_level: 1, min_points_required: 0,
        cover_image_id: 5, bg_image_id: 5     
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successModal, setSuccessModal] = useState({ show: false, nextRoute: '' });
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
                cover_image_id: formData.bg_image_id
            };

            const data = await createRoom(roomDataForServer);

            if (data.success) {
                const newRoomId = data.roomId || data.id;
                setSuccessModal({ show: true, nextRoute: newRoomId ? `/manage-room/${newRoomId}` : '/developer' });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'שגיאה ביצירת האתגר.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <Navbar />
            <div className={styles.contentWrapper}>
                
                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}
                
                <RoomForm 
                    formData={formData} 
                    handleChange={handleChange} 
                    handleSubmit={handleSubmit} 
                    loading={loading} 
                    isEdit={false} 
                />
            </div>

            {successModal.show && (
                <Modal 
                    title="פעולה הושלמה" 
                    titleColor="#10b981" 
                    message="ההגדרות נשמרו! אפשר להתקדם להוספת חידות." 
                    confirmText="המשך לשלב הבא 🚀" 
                    confirmType="success" 
                    onConfirm={() => navigate(successModal.nextRoute)} 
                />
            )}
        </div>
    );
};

export default CreateRoom;