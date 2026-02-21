import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ThemeProvider } from './contexts/ThemeContext';
import { ChatPage } from './pages/ChatPage';
import { LandingPage } from './pages/LandingPage';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<AppLayout />}>
            <Route path="/app" element={<ChatPage />} />
            <Route path="/app/c/:conversationId" element={<ChatPage />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
