import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import FileExplorer from '../components/FileExplorer';
import CodeEditor from '../components/CodeEditor'; // Using AceEditor
import OutputWindow from '../components/Terminal';
import AIChatPanel from '../components/featurePanels/AIChatPanel'; // Import AIChatPanel
import { ResizableBox } from 'react-resizable';
import '../style/ide.css';
import ErrorBoundary from '../components/ErrorBoundary';
import ChatContainer from '../components/chatFolder/ChatContainer';

const IdePage = () => {
  const [openedFile, setOpenedFile] = useState(null);
  const [isTerminalVisible, setIsTerminalVisible] = useState(true);
  const [fileExplorerWidth, setFileExplorerWidth] = useState(250);
  const [editorSettings, setEditorSettings] = useState({
    fontSize: 14,
    lineWrapping: true,
    codeFolding: true,
  });
  const [isAIChatOpen, setIsAIChatOpen] = useState(false); // New state for AI chat visibility

  const handleFileOpen = (fileContent) => {
    console.log('Opening file content:', fileContent);
    setOpenedFile(fileContent);
  };

  return (
    <div className="ide-container">
      <div className="box">
        {/* Resizable File Explorer */}
        <ResizableBox
          className="file-explorer"
          width={fileExplorerWidth}
          height={Infinity}
          minConstraints={[150, Infinity]}
          maxConstraints={[300, Infinity]}
          axis="x"
          onResizeStop={(e, data) => setFileExplorerWidth(data.size.width)}
        >
          <FileExplorer onFileOpen={handleFileOpen} />
        </ResizableBox>

        {/* Main Content Area */}
        <div className={`main-content ${isAIChatOpen ? 'reduced-width' : ''}`}> {/* Apply reduced width when AI chat is open */}
          <div className="code-editor">
            <ErrorBoundary>
              <CodeEditor
                code={openedFile ? openedFile.content : ''}
                language={openedFile ? openedFile.language : 'javascript'}
                theme="custom"
                settings={editorSettings}
                onChange={(newValue) => console.log('Editor changed:', newValue)}
              />
            </ErrorBoundary>
          </div>

          {/* Terminal */}
          {isTerminalVisible && (
            <div className={`terminal ${isAIChatOpen ? 'reduced-width' : ''}`}>
              <OutputWindow />
            </div>
          )}

          {/* Terminal Toggle Button */}
          <div
            className="terminal-toggle-button"
            onClick={() => setIsTerminalVisible(!isTerminalVisible)}
          >
            {isTerminalVisible ? 'Close Terminal' : 'Open Terminal'}
          </div>
        </div>

        {/* AI Chat Panel */}
        {isAIChatOpen && (
          <div className="ai-chat-panel">
            <AIChatPanel onClose={() => setIsAIChatOpen(false)} /> {/* Pass a close handler to AIChatPanel */}
          </div>
        )}

        {/* Sidebar */}
        <div className="right-sidebar">
          <Sidebar onAIChatToggle={() => setIsAIChatOpen(!isAIChatOpen)} /> {/* Pass toggle function to Sidebar */}
        </div>
      </div>
    </div>
  );
};

export default IdePage;
