import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaTimes } from "react-icons/fa";
import { PulseLoader } from "react-spinners";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const maxChars = 500;

function AIChatPanel({ onClose }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]); // Store chat messages
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [charLimitWarning, setCharLimitWarning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(true);
  const answerRef = useRef(null);

  useEffect(() => {
    setCharLimitWarning(question.length > maxChars);
  }, [question]);

  const generateAnswer = async (e) => {
    e.preventDefault();
    if (question.length > maxChars) return;

    // Add user's question to messages
    setMessages((prev) => [...prev, { type: 'user', text: question }]);
    setGeneratingAnswer(true);
    setQuestion("");

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      const answerText = response.data.candidates[0].content.parts[0].text;
      setMessages((prev) => [...prev, { type: 'ai', text: answerText }]);
      setGeneratingAnswer(false);
    } catch (error) {
      console.log(error);
      setMessages((prev) => [...prev, { type: 'ai', text: "Sorry - Something went wrong. Please try again!" }]);
      setGeneratingAnswer(false);
    }
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const closePanel = () => {
    setVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const renderMessage = (message, index) => {
    const isUser = message.type === 'user';

    return (
      <div key={index} className={`my-2 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xs p-3 rounded-lg ${isUser ? 'bg-violet-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
          {isUser ? (
            <ReactMarkdown>{message.text}</ReactMarkdown>
          ) : (
            renderAnswer(message.text)
          )}
          <CopyToClipboard text={message.text} onCopy={handleCopy}>
            <button className={`text-xs mt-1 ${copied ? "text-green-500" : "text-gray-600"}`}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </CopyToClipboard>
        </div>
      </div>
    );
  };

  const renderAnswer = (text) => {
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const parts = text.split(codeBlockRegex);

    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return (
          <SyntaxHighlighter
            key={i}
            language="javascript"
            style={vscDarkPlus}
            className="my-4 p-3 bg-gray-900 rounded-lg"
          >
            {part.trim()}
          </SyntaxHighlighter>
        );
      }

      return (
        <ReactMarkdown
          key={i}
          components={{
            h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-4" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mb-3" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-lg font-medium mb-2" {...props} />,
            strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
            li: ({ node, ...props }) => <li className="list-disc list-inside mb-1" {...props} />,
            p: ({ node, ...props }) => <p className="mb-4 text-gray-800" {...props} />,
          }}
          className="prose prose-violet text-gray-800 leading-relaxed"
        >
          {part}
        </ReactMarkdown>
      );
    });
  };

  return (
    <div
      className={`fixed top-0 right-0 w-[400px] h-[750px] mr-[70px] bg-gradient-to-b from-violet-7a00 to-white p-4 rounded-3xl shadow-lg overflow-hidden z-50 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0 invisible'}`}
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
      {/* Header with Close Icon */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-700">AI Chat</h1>
        <button onClick={closePanel} className="text-gray-600 hover:bg-gray-400 p-2 rounded-full">
          <FaTimes size={20} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-2 rounded-lg shadow-md mb-4 bg-white bg-opacity-80 custom-scroll">
          <div className="bg-gray-200 p-2 rounded-lg text-gray-800 mb-4">
            Ask the AI a question and get a response. Try out the chat!
          </div>

          {messages.map(renderMessage)}

          {generatingAnswer && (
            <div className="flex items-center justify-center">
              <PulseLoader color="#1d4ed8" />
            </div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={generateAnswer} className="flex flex-col space-y-3 p-3 bg-white shadow-lg rounded-lg mb-10">
          <textarea
            className={`border p-2 rounded-lg focus:outline-none ${charLimitWarning ? 'border-red-500' : 'border-gray-300'} focus:border-blue-400`}
            rows="3"
            required
            placeholder="Type your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            maxLength={maxChars + 50}
          ></textarea>
          {charLimitWarning && (
            <p className="text-red-500 text-sm">You have reached the character limit!</p>
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            disabled={generatingAnswer || charLimitWarning}
          >
            {generatingAnswer ? "Generating..." : "Send"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          display: none; /* Hide scrollbar for Chrome, Safari and Opera */
        }

        .custom-scroll {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
}

export default AIChatPanel;
