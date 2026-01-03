import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/Theme.jsx';
import { UserProvider } from './context/User.jsx';
import './index.css'
import App from './App.jsx'
import { SnackbarProvider } from './context/Snackbar.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <SnackbarProvider>
      <ThemeProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </ThemeProvider>
    </SnackbarProvider>
  </BrowserRouter>,
)
