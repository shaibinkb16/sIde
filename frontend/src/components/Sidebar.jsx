import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineSetting, AiOutlineMessage } from 'react-icons/ai';
import { GoGitBranch as AiOutlineGit } from 'react-icons/go';
import { IoIosChatbubbles } from 'react-icons/io';

const Sidebar = ({ onAIChatToggle }) => {
  const [activeTab, setActiveTab] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="bg-gray-900 text-white h-full shadow-lg p-4 fixed right-0 top-0 w-16 flex flex-col justify-between items-center ">
      <ul className="space-y-8">
        {/* Ask AI */}
        <li className="flex flex-col items-center group">
          <button
            onClick={() => {
              handleTabChange('ai-chat');
              onAIChatToggle();
            }}
            className={`flex flex-col items-center space-y-1 transition-transform transform group-hover:scale-11 duration-300 border-none ${
              activeTab === 'ai-chat' ? 'text-pink-400' : 'text-gray-300'
            }`}
          >
            <AiOutlineMessage
              size={28}
              className="group-hover:text-pink-400 transition-colors duration-300 "
            />
            <span
              className={`text-xs mt-1 w transition-colors duration-300 ${
                activeTab === 'ai-chat' ? 'text-pink-400' : 'text-gray-400'
              }`}
            >
              Ask AI 
            </span>
          </button>
        </li>

        {/* Collaboration */}
        <li className="flex flex-col items-center group">
          <Link
            to="/real-time-collab"
            onClick={() => handleTabChange('collab')}
            className={`flex flex-col items-center space-y-1 transition-transform transform group-hover:scale-110 duration-300 ${
              activeTab === 'collab' ? 'text-green-400' : 'text-gray-300'
            }`}
          >
            <AiOutlineMessage
              size={28}
              className="group-hover:text-green-400 transition-colors duration-300"
            />
            <span
              className={`text-xs mt-1 transition-colors duration-300 ${
                activeTab === 'collab' ? 'text-green-400' : 'text-gray-400'
              }`}
            >
              Collab
            </span>
          </Link>
        </li>

        {/* Git Control */}
        <li className="flex flex-col items-center group">
          <Link
            to="/git-control"
            onClick={() => handleTabChange('git')}
            className={`flex flex-col items-center space-y-1 transition-transform transform group-hover:scale-110 duration-300 ${
              activeTab === 'git' ? 'text-blue-400' : 'text-gray-300'
            }`}
          >
            <AiOutlineGit
              size={28}
              className="group-hover:text-blue-400 transition-colors duration-300"
            />
            <span
              className={`text-xs mt-1 transition-colors duration-300 ${
                activeTab === 'git' ? 'text-blue-400' : 'text-gray-400'
              }`}
            >
              Git
            </span>
          </Link>
        </li>

        {/* Real-time Chat */}
        <li className="flex flex-col items-center group">
          <Link
            to="/real-time-chat"
            onClick={() => handleTabChange('chat')}
            className={`flex flex-col items-center space-y-1 transition-transform transform group-hover:scale-110 duration-300 ${
              activeTab === 'chat' ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            <IoIosChatbubbles
              size={28}
              className="group-hover:text-yellow-400 transition-colors duration-300"
            />
            <span
              className={`text-xs mt-1 transition-colors duration-300 ${
                activeTab === 'chat' ? 'text-yellow-400' : 'text-gray-400'
              }`}
            >
              Chat
            </span>
          </Link>
        </li>
      </ul>

      {/* Settings */}
      <div className="flex flex-col items-center group">
        <Link
          to="/settings"
          onClick={() => handleTabChange('settings')}
          className={`flex flex-col items-center space-y-1 transition-transform transform group-hover:scale-110 duration-300 ${
            activeTab === 'settings' ? 'text-purple-400' : 'text-gray-300'
          }`}
        >
          <AiOutlineSetting
            size={28}
            className="group-hover:text-purple-400 transition-colors duration-300"
          />
          <span
            className={`text-xs mt-1 transition-colors duration-300 ${
              activeTab === 'settings' ? 'text-purple-400' : 'text-gray-400'
            }`}
          >
            Settings
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
