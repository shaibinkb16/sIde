import React, { useState, useEffect, useRef } from 'react';
import AceEditor from 'react-ace';
import esprima from 'esprima';  // For syntax checking
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/ext-language_tools'; // For autocompletion
import 'ace-builds/src-noconflict/ext-error_marker';  // For error markers
import '../constants/theme-custom'; // Adjust the path to your theme file

const { ipcRenderer } = window.require('electron');

const CodeEditor = ({ onChange, language, code, theme, settings }) => {
  const [editorValue, setEditorValue] = useState(code || '');
  const [annotations, setAnnotations] = useState([]);
  const aceEditorRef = useRef(null);

  useEffect(() => {
    if (aceEditorRef.current) {
      aceEditorRef.current.editor.setValue(code || '');
    }
  }, [code]);

  useEffect(() => {
    ipcRenderer.on('save-file', handleSaveFile);
    ipcRenderer.on('save-as-file', handleSaveAsFile);
    
    return () => {
      ipcRenderer.removeAllListeners('save-file');
      ipcRenderer.removeAllListeners('save-as-file');
    };
  }, [editorValue]);

  const handleEditorChange = (value) => {
    setEditorValue(value);
    if (onChange) onChange('code', value);
    checkSyntax(value); // Check for errors
  };

  const handleSaveFile = (event, filePath) => {
    ipcRenderer.send('save-file', filePath, editorValue);
  };

  const handleSaveAsFile = (event, filePath) => {
    ipcRenderer.send('save-as-file', filePath, editorValue);
  };

  const checkSyntax = (code) => {
    try {
      esprima.parseScript(code, { tolerant: true });
      setAnnotations([]);
    } catch (err) {
      setAnnotations([{ row: err.lineNumber - 1, column: err.column, text: err.description, type: 'error' }]);
    }
  };

  useEffect(() => {
    if (aceEditorRef.current) {
      aceEditorRef.current.editor.getSession().setAnnotations(annotations);
    }
  }, [annotations]);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-grow">
        <AceEditor
          ref={aceEditorRef}
          mode={language || 'javascript'}
          theme={theme || 'custom'}
          name="ace-editor"
          value={editorValue}
          onChange={handleEditorChange}
          editorProps={{ $blockScrolling: true }}
          width="100%"
          height="100%"
          fontSize={settings.fontSize} // Dynamic font size from settings
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          enableBasicAutocompletion={true}
          enableLiveAutocompletion={true}
          enableSnippets={true}
          enableFoldWidgets={settings.codeFolding} // Dynamic code folding from settings
          setOptions={{
            wrap: settings.lineWrapping, // Dynamic line wrapping from settings
            showLineNumbers: true,
            tabSize: 2,
            useWorker: false
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
