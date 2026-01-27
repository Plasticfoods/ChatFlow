import Home from './components/Home'
import { Routes, Route, Navigate } from 'react-router-dom';
import Contacts from './components/Contacts';
import Settings from './components/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import { LoginPage, RegisterPage } from './components/AuthenticationPage';
import ProfilePage from './components/ProfilePage';
import './App.css';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

function App() {
    console.log("API URL:", process.env.VITE_API_URL);
  
    // Set default axios configuration
    axios.defaults.baseURL = process.env.VITE_API_URL;
    axios.defaults.withCredentials = true;

  const routes = [
    { path:"/" , element:<Home />, isProtected:true },
    { path:"/contacts" , element:<Contacts /> , isProtected:true },
    { path:"/settings" , element:<Settings /> , isProtected:true },
    { path:"/profile" , element:<ProfilePage /> , isProtected:true },
    { path:"/login" , element:<LoginPage /> , isProtected:false },
    { path:"/register" , element:<RegisterPage /> , isProtected:false },
  ];

  return (
    <div id="App"
      // This for overlay loading animation
      style={{ position: "relative" }}
    >
      <Routes>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              route.isProtected ? (
                <ProtectedRoute>
                  {route.element}
                </ProtectedRoute>
              ) : (
                route.element
              )
            }
          />
        ))}
        {/* <Route path="/login" element={<LoginPage />} />
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
        /> */}
        {/* Default Redirect: Go straight to /chats when opening the app */}
        {/* <Route path="/" element={<Navigate to="/chats" replace />} />       */}
      </Routes>
    </div>
  )
}

export default App
