import React, { useState, useCallback, useRef } from 'react';
import FileExplorer from './FileExplorer'; // Import FileExplorer component
import CodeEditor from './CodeEditor'; // Import CodeEditor component

const ResizableLayout = () => {
  const [fileExplorerWidth, setFileExplorerWidth] = useState(320); // Initial width of FileExplorer
  const [editorWidth, setEditorWidth] = useState(window.innerWidth - 320); // Initial width of CodeEditor
  const resizeRef = useRef(null);

  const startResize = useCallback((e) => {
    const initialX = e.clientX;

    const doResize = (e) => {
      const newFileExplorerWidth = fileExplorerWidth + (e.clientX - initialX);
      const newEditorWidth = window.innerWidth - newFileExplorerWidth;
      setFileExplorerWidth(newFileExplorerWidth > 100 ? newFileExplorerWidth : 100);
      setEditorWidth(newEditorWidth > 100 ? newEditorWidth : 100);
    };

    const stopResize = () => {
      document.removeEventListener('mousemove', doResize);
      document.removeEventListener('mouseup', stopResize);
    };

    document.addEventListener('mousemove', doResize);
    document.addEventListener('mouseup', stopResize);
  }, [fileExplorerWidth]);

  return (
    <div className="flex h-full">
      <FileExplorer width={fileExplorerWidth} />
      <div
        ref={resizeRef}
        onMouseDown={startResize}
        className="cursor-col-resize bg-gray-400 w-1 h-full"
      />
      <div
        className="flex-grow"
        style={{ width: `${editorWidth}px` }}
      >
        <CodeEditor content="console.log('Hello, world!');" />
      </div>
    </div>
  );
};

export default ResizableLayout;
