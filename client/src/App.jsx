import Home from './components/Home'
import { Routes, Route, Navigate } from 'react-router-dom';
import Contacts from './components/Contacts';
import Settings from './components/Settings';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { LoginPage, RegisterPage } from './components/AuthenticationPage';
import './App.css'

function App() {

  return (
    <div id="App"
      // This for overlay loading animation
      style={{ position: "relative" }}
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/settings" element={<Settings />} />
        <Route 
          path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        {/* Default Redirect: Go straight to /chats when opening the app */}
        {/* <Route path="/" element={<Navigate to="/chats" replace />} />       */}
      </Routes>
    </div>
  )
}

export default App
