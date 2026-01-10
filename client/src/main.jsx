import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/Theme.jsx';
import { UserProvider } from './context/User.jsx';
import { ChatProvider } from './context/Chat.jsx';
import './index.css'
import App from './App.jsx'
import { SnackbarProvider } from './context/Snackbar.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <SnackbarProvider>
      <ThemeProvider>
        <UserProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
        </UserProvider>
      </ThemeProvider>
    </SnackbarProvider>
  </BrowserRouter>,
)
