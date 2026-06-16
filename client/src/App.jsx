import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Lobby from './pages/Lobby';
import DeveloperDashboard from './pages/DeveloperDashboard';
import CreateRoom from './pages/CreateRoom';
import ManageRoomQuestions from './pages/ManageRoomQuestions';
import EditRoom from './pages/EditRoom';
import PlayRoom from './pages/PlayRoom'; 
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'; 

import './assets/fonts/fonts.css';


function App() {
  return (
    <Routes>
      {/* 1. הראוטים הציבוריים (נשארו נקיים כרגיל) */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 2. אזור השחקנים בלבד (שומר אחד עוטף את כל הראוטים שבתוכו!) */}
      <Route element={<ProtectedRoute allowedRoles={['player']} />}>
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/play/:roomId" element={<PlayRoom />} />
      </Route>

      {/* 3. אזור המפתחים בלבד (שומר אחד עוטף את הכל!) */}
      <Route element={<ProtectedRoute allowedRoles={['developer']} />}>
        <Route path="/developer" element={<DeveloperDashboard />} />
        <Route path="/developer/create-room" element={<CreateRoom />} />
        <Route path="/developer/edit-room/:roomId" element={<EditRoom />} />
        <Route path="/manage-room/:roomId" element={<ManageRoomQuestions />} />
      </Route>
      
    </Routes>
  );
}

export default App;
