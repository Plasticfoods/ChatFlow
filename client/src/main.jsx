import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/Theme.jsx';
import { UserProvider } from './context/User.jsx';
import { ChatProvider } from './context/Chat.jsx';
import './index.css'
import App from './App.jsx'
import { SnackbarProvider } from './context/Snackbar.jsx';
import { SocketProvider } from './context/Socket.jsx';
import { OnlineUsersProvider } from './context/OnlineUsers.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <SnackbarProvider>
      <ThemeProvider>
        <UserProvider>
          <SocketProvider>
            <OnlineUsersProvider>
              <ChatProvider>
                <App />
              </ChatProvider>
            </OnlineUsersProvider>
          </SocketProvider>
        </UserProvider>
      </ThemeProvider>
    </SnackbarProvider>
  </BrowserRouter>,
)
