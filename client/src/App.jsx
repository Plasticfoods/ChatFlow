import Home from './components/Home'
import { Routes, Route, Navigate } from 'react-router-dom';
import Contacts from './components/Contacts';
import Settings from './components/Settings';
import Profile from './components/Profile';
import './App.css'

function App() {

  return (
    <div id="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        {/* Default Redirect: Go straight to /chats when opening the app */}
        {/* <Route path="/" element={<Navigate to="/chats" replace />} />       */}
      </Routes>
    </div>
  )
}

export default App
