import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar'; // Import the Sidebar
import RegistrationPage from './pages/RegistrationForm';
import LoginPage from './pages/LoginPage';
import IdePage from './pages/IdePage';
import SettingsPage from './pages/SettingsPage';
import AIchatPanel from './components/featurePanels/AIchatPanel';
import RealTimeCollabPanel from './components/featurePanels/RealTimeCollabPanel';
import RealTimeChatPanel from './components/featurePanels/RealTimeChatPanel';
import GitControlPanel from './components/featurePanels/GitControlPanel';
import Terminal from './components/Terminal';
import './index.css'; // Your global styles if any
import './App.css';

const App = () => (
  <Router>
    <Routes>
      {/* Registration and Login Routes */}
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* IDE with Sidebar */}
      <Route
        path="/ide"
        element={
          <>
            <Sidebar /> {/* Sidebar is shown here */}
            <IdePage /> {/* IDE page with code editor, etc. */}
          </>
        }
      />

      {/* Settings */}
      <Route
        path="/settings"
        element={
          <>
            <Sidebar /> {/* Sidebar for easy navigation */}
            <SettingsPage />
          </>
        }
      />

      {/* AI Chat Panel */}
      <Route
        path="/ai-chat"
        element={
          <>
            <Sidebar /> {/* Sidebar */}
            <AIchatPanel />
          </>
        }
      />

      {/* Real-time Collaboration Panel */}
      <Route
        path="/real-time-collab"
        element={
          <>
            <Sidebar /> {/* Sidebar */}
            <RealTimeCollabPanel />
          </>
        }
      />

      {/* Git Control Panel */}
      <Route
        path="/git-control"
        element={
          <>
            <Sidebar /> {/* Sidebar */}
            <GitControlPanel />
          </>
        }
      />

      {/* Terminal */}
      <Route
        path="/terminal"
        element={
          <>
            <Sidebar /> {/* Sidebar */}
            <Terminal />
          </>
        }
      />

      {/* Real-time Chat Panel */}
      <Route
        path="/real-time-chat"
        element={
          <>
            <Sidebar /> {/* Sidebar */}
            <RealTimeChatPanel />
          </>
        }
      />

      {/* Redirect to login if no other routes match */}
      <Route path="*" element={<LoginPage />} />
    </Routes>
  </Router>
);

export default App;
/* 
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar'; // Import the Sidebar
import RegistrationPage from './pages/RegistrationForm';
import LoginPage from './pages/LoginPage';
import IdePage from './pages/IdePage';
import SettingsPage from './pages/SettingsPage';
import AIchatPanel from './components/featurePanels/AIchatPanel'
import RealTimeCollabPanel from './components/featurePanels/RealTimeCollabPanel';
import RealTimeChatPanel from './components/featurePanels/RealTimeChatPanel';
import GitControlPanel from './components/featurePanels/GitControlPanel';
import Terminal from './components/Terminal';
import './index.css'; // Your global styles if any
import './App.css';

const App = () => (
  
  <Router>
    
    
        <Routes>
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/ide" element={<IdePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/ai-chat" element={<AIchatPanel />} />
          <Route path="/real-time-collab" element={<RealTimeCollabPanel />} />
          <Route path="/git-control" element={<GitControlPanel />} />
          <Route path="/terminal" element={<Terminal />} />
          <Route path="/real-time-chat" element={<RealTimeChatPanel />} />
          {/* Redirect to login if no other routes match }
          <Route path="*" element={<LoginPage />} />

        </Routes>
    
  </Router>
);

export default App;


 */