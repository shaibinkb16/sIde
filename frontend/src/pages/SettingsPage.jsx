import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SettingsPage = ({ onSettingsChange }) => {
  const [user, setUser] = useState({ username: '', email: '', isGoogleUser: false });
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileError, setProfileError] = useState('');
  const [loading, setLoading] = useState(false);

  // IDE settings
  const [fontSize, setFontSize] = useState(14);
  const [lineWrapping, setLineWrapping] = useState(false);
  const [codeFolding, setCodeFolding] = useState(true);
  const [theme, setTheme] = useState('light');
  const [tabSize, setTabSize] = useState(2);
  const [autoSave, setAutoSave] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      const isGoogleUser = localStorage.getItem('isGoogleUser') === 'true';

      if (token || isGoogleUser) {
        if (isGoogleUser) {
          const savedUsername = localStorage.getItem('username');
          const savedEmail = localStorage.getItem('email');

          if (savedUsername && savedEmail) {
            setUser({ username: savedUsername, email: savedEmail, isGoogleUser: true });
            setUsername(savedUsername);
            setEmail(savedEmail);
          } else {
            // Navigate to login if the information is not present
            navigate('/login');
          }
        } else {
          try {
            const response = await axios.get('/api/user/me', {
              headers: { Authorization: `Bearer ${token}` },
            });

            const { username, email, isGoogleUser } = response.data;
            setUser({ username, email, isGoogleUser });
            setUsername(username);
            setEmail(email);
          } catch (error) {
            console.error('Error fetching user profile:', error);
            navigate('/login');
          }
        }
      }
    };

    fetchUserProfile();
  }, [navigate]);

  useEffect(() => {
    // Retrieve settings from localStorage
    const savedFontSize = localStorage.getItem('fontSize');
    const savedLineWrapping = localStorage.getItem('lineWrapping') === 'true';
    const savedCodeFolding = localStorage.getItem('codeFolding') === 'true';
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedTabSize = Number(localStorage.getItem('tabSize')) || 2;
    const savedAutoSave = localStorage.getItem('autoSave') === 'true';

    if (savedFontSize) setFontSize(Number(savedFontSize));
    if (savedLineWrapping) setLineWrapping(savedLineWrapping);
    if (savedCodeFolding) setCodeFolding(savedCodeFolding);
    if (savedTheme) setTheme(savedTheme);
    if (savedTabSize) setTabSize(savedTabSize);
    if (savedAutoSave) setAutoSave(savedAutoSave);

  }, []);

  const handleSaveSettings = () => {
    // Save settings to localStorage
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('lineWrapping', lineWrapping);
    localStorage.setItem('codeFolding', codeFolding);
    localStorage.setItem('theme', theme);
    localStorage.setItem('tabSize', tabSize);
    localStorage.setItem('autoSave', autoSave);

    if (onSettingsChange) {
      onSettingsChange({ fontSize, lineWrapping, codeFolding, theme, tabSize, autoSave });
    }

    alert('Settings saved successfully');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isGoogleUser');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    navigate('/login');
  };

  const handleProfileUpdate = async () => {
    if (!username || !email) {
      setProfileError('Username and email are required');
      return;
    }

    if (username === user.username && email === user.email) {
      setProfileError('No changes detected');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.put('/api/user/update', { username, email }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser({ username, email, isGoogleUser: user.isGoogleUser });
      setProfileError('');
    } catch (error) {
      setProfileError('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      setProfileError('Both current and new passwords are required');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.put('/api/user/change-password', { currentPassword, newPassword }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCurrentPassword('');
      setNewPassword('');
      setProfileError('');
      alert('Password changed successfully');
    } catch (error) {
      setProfileError('Failed to change password');
      console.error('Error changing password:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToIDE = () => {
    navigate('/ide');
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-screen bg-gray-900 rounded-3xl mx-auto my-8">
      {/* Sidebar */}
      <div className="bg-gray-800 w-full md:w-1/3 p-6 text-white rounded-md">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 mb-4 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white text-3xl">{user.username.charAt(0)}</span>
          </div>
          <h2 className="text-2xl font-semibold">{user.username}</h2>
          <p className="text-gray-400 mb-4">{user.email}</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Logout
          </button>

          {/* Profile Update Form */}
          {!user.isGoogleUser && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Update Profile</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block mb-2">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setProfileError('');
                    }}
                    className="border border-gray-300 p-2 w-full rounded text-black"
                  />
                </div>
                <div>
                  <label className="block mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setProfileError('');
                    }}
                    className="border border-gray-300 p-2 w-full rounded text-black"
                  />
                </div>
                <button
                  onClick={handleProfileUpdate}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
                {profileError && <p className="text-red-500 mt-4">{profileError}</p>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-900 w-full md:w-2/3 p-6 text-white">
        <button
          onClick={handleBackToIDE}
          className="bg-gray-500 text-white py-2 px-4 rounded mb-6 hover:bg-gray-600"
        >
          Back to IDE
        </button>

        <h2 className="text-3xl font-semibold mb-6">IDE Settings</h2>

        {/* IDE Settings */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">IDE Settings</h3>
          {/* Font Size */}
          <label className="block mb-2">Font Size</label>
          <input
            type="range"
            min="10"
            max="30"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full mb-4"
          />
          <span>Font Size: {fontSize}</span>

          {/* Line Wrapping */}
          <label className="block mb-2 mt-4">Line Wrapping</label>
          <input
            type="checkbox"
            checked={lineWrapping}
            onChange={(e) => setLineWrapping(e.target.checked)}
            className="mr-2"
          />
          <span>Enable Line Wrapping</span>

          {/* Code Folding */}
          <label className="block mb-2 mt-4">Code Folding</label>
          <input
            type="checkbox"
            checked={codeFolding}
            onChange={(e) => setCodeFolding(e.target.checked)}
            className="mr-2"
          />
          <span>Enable Code Folding</span>

          {/* Theme Selection */}
          <label className="block mb-2 mt-4">Theme</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="dracula">Dracula</option>
            {/* Add more theme options as needed */}
          </select>

          {/* Tab Size */}
          <label className="block mb-2 mt-4">Tab Size</label>
          <input
            type="number"
            min="2"
            max="8"
            value={tabSize}
            onChange={(e) => setTabSize(Number(e.target.value))}
            className="border border-gray-300 p-2 w-full rounded"
          />

          {/* Auto-save */}
          <label className="block mb-2 mt-4">Auto-Save</label>
          <input
            type="checkbox"
            checked={autoSave}
            onChange={(e) => setAutoSave(e.target.checked)}
            className="mr-2"
          />
          <span>Enable Auto-Save</span>

          <button
            onClick={handleSaveSettings}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mt-6"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
