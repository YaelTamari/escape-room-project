
import React from 'react'; 
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Lobby from './pages/Lobby';
import DeveloperDashboard from './pages/DeveloperDashboard';
import CreateRoom from './pages/CreateRoom'; 
import ManageRoomQuestions from './pages/ManageRoomQuestions';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/lobby" element={<Lobby />} />
      <Route path="/developer" element={<DeveloperDashboard />} />
      <Route path="/developer/create-room" element={<CreateRoom />} />
      <Route path="/manage-room/:roomId" element={<ManageRoomQuestions />} />
    </Routes>
  );
}

export default App;