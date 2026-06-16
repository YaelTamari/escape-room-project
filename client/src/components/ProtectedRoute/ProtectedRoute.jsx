import React, { useContext } from 'react';
// הוספנו את Outlet !
import { Navigate, Outlet } from 'react-router-dom'; 
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>טוען...</div>;
    if (!user) return <Navigate to="/login" replace />;

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={user.role === 'developer' ? '/developer' : '/lobby'} replace />;
    }

    // הוספנו פה חוק חכם: אם שמנו בתוכו ילדים - תציג אותם. אם לא, תציג את הראוטים שמתחתיו (Outlet)
    return children ? children : <Outlet />;
};

export default ProtectedRoute;
