import React, { useEffect, useState } from 'react';
const { ipcRenderer } = window.require('electron');

// Import file type icons
import folderPng from "../assets/folder.png";
import folderOpen from "../assets/open-folder.png";
import javaPng from "../assets/java.png";
import pythonPng from "../assets/python.png";
import htmlPng from "../assets/code.png";
import cssPng from "../assets/css.png";
import reactPng from "../assets/atom.png";
import jsPng from "../assets/js.png";
import docPng from "../assets/doc.png";
import pdfPng from "../assets/pdf.png";
import docxPng from "../assets/docx.png";
import imagePng from "../assets/image.png";
import filePng from "../assets/file.png"; // Default file icon

const FileExplorer = ({ onFileOpen }) => {
  const [folderStructure, setFolderStructure] = useState([]);
  const [openFolders, setOpenFolders] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleFolderSelected = (event, structure) => {
      console.log('Received folder structure:', structure); // Debugging
      setFolderStructure(structure);
    };

    const handleFileOpened = (event, { filePath, content }) => {
      console.log('Received file content:', { filePath, content }); // Debugging
      onFileOpen({ filePath, content });
    };

    ipcRenderer.on('folder-selected', handleFolderSelected);
    ipcRenderer.on('file-opened', handleFileOpened);

    return () => {
      ipcRenderer.removeListener('folder-selected', handleFolderSelected);
      ipcRenderer.removeListener('file-opened', handleFileOpened);
    };
  }, [onFileOpen]);

  const handleFileClick = (file) => {
    ipcRenderer.send('open-file', file.path);
  };

  const handleFolderToggle = (path) => {
    setOpenFolders(prevState => ({
      ...prevState,
      [path]: !prevState[path]
    }));
  };

  const getIconForFile = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
      case 'java': return javaPng;
      case 'py': return pythonPng;
      case 'html': return htmlPng;
      case 'css': return cssPng;
      case 'jsx': case 'react': return reactPng;
      case 'js': return jsPng;
      case 'doc': return docPng;
      case 'pdf': return pdfPng;
      case 'docx': return docxPng;
      case 'png': case 'jpg': case 'jpeg': case 'gif': return imagePng;
      default: return filePng;
    }
  };

  const renderFolderItems = (items) => {
    return items
      .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(item => (
        <FolderItem
          key={item.path}
          item={item}
          isOpen={openFolders[item.path]}
          onFileClick={handleFileClick}
          onToggle={handleFolderToggle}
          getIconForFile={getIconForFile}
          openFolders={openFolders}
        />
      ));
  };

  return (
    <div className="w-full h-full bg-gray-100 text-black p-3 overflow-y-auto">
      <input
        type="text"
        placeholder="Search files..."
        className="w-full mb-3 p-2 border rounded"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {folderStructure.length === 0 ? (
        <p className="text-gray-800">No files to display</p>
      ) : (
        <div>
          <Breadcrumbs path={folderStructure[0]?.path} />
          {renderFolderItems(folderStructure)}
        </div>
      )}
    </div>
  );
};

const FolderItem = ({ item, isOpen, onFileClick, onToggle, getIconForFile, openFolders }) => {
  const handleClick = () => {
    if (item.isDirectory) {
      onToggle(item.path);
    } else {
      onFileClick(item);
    }
  };

  return (
    <div className="mb-1">
      <div
        className="flex items-center cursor-pointer hover:bg-gray-300 px-2 py-1 rounded-md"
        onClick={handleClick}
      >
        {item.isDirectory ? (
          <img
            src={isOpen ? folderOpen : folderPng}
            alt="Folder"
            className="w-4 h-4 mr-2"
          />
        ) : (
          <img
            src={getIconForFile(item.name)}
            alt="File"
            className="w-4 h-4 mr-2"
          />
        )}
        <span className="truncate text-gray-800">{item.name}</span>
      </div>
      {isOpen && item.isDirectory && item.children && (
        <div className="ml-4">
          {item.children.map(child => (
            <FolderItem
              key={child.path}
              item={child}
              isOpen={openFolders[child.path]}
              onFileClick={onFileClick}
              onToggle={onToggle}
              getIconForFile={getIconForFile}
              openFolders={openFolders}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Breadcrumbs = ({ path }) => {
  const folderName = path ? path.split('/')[1] || path.split('\\')[1] || path : '';

  return (
    <div className="mb-2 text-gray-700">
      {folderName && <span><strong>Folder Name: {folderName}</strong></span>}
    </div>
  );
};

export default FileExplorer;