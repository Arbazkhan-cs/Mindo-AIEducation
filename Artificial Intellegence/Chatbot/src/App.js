import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize theme from localStorage or default to 'light'
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.className = savedTheme;
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme;
  };

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when messages change
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Send message to Groq API
  const sendMessage = async () => {
    if (!input.trim()) return;
    if (!apiKey) {
      setError('Please enter your Groq API key first');
      return;
    }

    // Add user message to chat
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'deepseek-r1-distill-llama-70b',
          messages: [
            { role: 'system', content: "You are a helpful, friendly AI assistant. Think through the question step-by-step before answering." },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            userMessage
          ],
          temperature: 0.7,
          max_tokens: 1024
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Add AI response to chat
      const aiMessage = { 
        role: 'assistant', 
        content: response.data.choices[0].message.content 
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error calling Groq API:', err);
      setError(err.response?.data?.error?.message || err.message || 'Failed to get response from Groq');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat history
  const clearChat = () => {
    setMessages([]);
    setIsMobileMenuOpen(false);
  };

  // Handle input form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className={`app-container ${theme}`}>
      <div className="app-header">
        <div className="logo-container">
          <img src="/api/placeholder/40/40" alt="Mindo Logo" className="app-logo" />
          <h1>Mindo Chatbot</h1>
        </div>
        <div className="header-controls">
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button 
            className="menu-toggle-btn" 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <h3>Menu</h3>
          <button onClick={toggleMobileMenu}>✕</button>
        </div>
        <div className="menu-content">
          <div className="api-key-section">
            <label htmlFor="api-key">Groq API Key</label>
            <input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Groq API key"
              className="api-key-input"
            />
          </div>
          <button className="clear-chat-btn" onClick={clearChat}>Clear Chat</button>
          <div className="powered-by">
            <h4>Powered by</h4>
            <p>Groq, DeepSeek</p>
          </div>
        </div>
      </div>

      <div className="main-content">
        {error && <div className="error-message">{error}</div>}

        <div className="chat-container">
          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="welcome-message">
                <div className="welcome-icon">💬</div>
                <h3>Welcome to Mindo AI!</h3>
                <p>Ask me anything you'd like to know.</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}
                >
                  <div className="message-bubble">
                    <div className="message-header">
                      {message.role === 'user' ? 'You' : 'Mindo AI'}
                    </div>
                    <div className="message-content">
                      {message.content.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                          {line}<br />
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="message-timestamp">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="message ai-message">
                <div className="message-bubble">
                  <div className="message-header">Mindo AI</div>
                  <div className="thinking-animation">
                    <div className="thinking-text">Thinking</div>
                    <div className="thinking-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="input-form">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="message-input"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="send-button"
              aria-label="Send message"
            >
              <span className="send-icon">➤</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;