import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaComments, FaTimes, FaPaperPlane, FaStar, FaMapMarkerAlt, FaUtensils, FaStore, FaShoppingCart, FaUser } from 'react-icons/fa';
import { fetchCartItems } from '../../actions/cartAction';

const LOGO_URL = '/images/logo.webp'; // Use public folder path

// Function to format bot responses with better structure
const formatBotResponse = (text) => {
  // Split text into sections based on common patterns
  const sections = text.split(/(?=🍽️|🏪|📋|💰|⭐|🥬|🍖|🔥|🏆|💡|•)/);
  
  return sections.map((section, index) => {
    if (!section.trim()) return null;
    
    // Check if it's a header section
    if (section.includes('🍽️') || section.includes('🏪') || section.includes('📋')) {
      return (
        <div key={index} style={{
          marginBottom: 12,
          padding: '8px 0',
          borderBottom: '1px solid #e8f4fd',
        }}>
          <div style={{
            fontWeight: 600,
            fontSize: 16,
            color: '#1890ff',
            marginBottom: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            {section.includes('🍽️') && <FaUtensils />}
            {section.includes('🏪') && <FaStore />}
            {section.includes('📋') && <FaComments />}
            {section}
          </div>
        </div>
      );
    }
    
    // Check if it's a list item
    if (section.includes('•')) {
      return (
        <div key={index} style={{
          marginBottom: 6,
          paddingLeft: 16,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            fontSize: 14,
            lineHeight: 1.4,
          }}>
            <span style={{ color: '#1890ff', fontSize: 12, marginTop: 2 }}>•</span>
            <span>{section.replace('•', '').trim()}</span>
          </div>
        </div>
      );
    }
    
    // Check if it contains ratings
    if (section.includes('⭐')) {
      return (
        <div key={index} style={{
          marginBottom: 8,
          padding: '6px 10px',
          background: '#f8f9ff',
          borderRadius: 8,
          border: '1px solid #e8f4fd',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 13,
            color: '#666',
          }}>
            <FaStar style={{ color: '#ffd700' }} />
            {section}
          </div>
        </div>
      );
    }
    
    // Check if it contains prices
    if (section.includes('💰')) {
      return (
        <div key={index} style={{
          marginBottom: 8,
          padding: '6px 10px',
          background: '#fff3cd',
          borderRadius: 8,
          border: '1px solid #ffeaa7',
        }}>
          <div style={{
            fontSize: 13,
            color: '#856404',
            fontWeight: 500,
          }}>
            {section}
          </div>
        </div>
      );
    }
    
    // Check if it contains recommendations
    if (section.includes('💡') || section.includes('🔥') || section.includes('🏆')) {
      return (
        <div key={index} style={{
          marginBottom: 8,
          padding: '8px 12px',
          background: '#d4edda',
          borderRadius: 8,
          border: '1px solid #c3e6cb',
        }}>
          <div style={{
            fontSize: 13,
            color: '#155724',
            fontWeight: 500,
          }}>
            {section}
          </div>
        </div>
      );
    }
    
    // Regular text
    return (
      <div key={index} style={{
        marginBottom: 8,
        fontSize: 14,
        lineHeight: 1.5,
      }}>
        {section}
      </div>
    );
  });
};

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am your Help Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Get user from Redux state
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleViewCart = () => {
    // Navigate to cart page or open cart modal
    window.location.href = '/cart';
  };

  // Function to update cart state after successful order
  const updateCartState = async () => {
    try {
      // Fetch updated cart data from the server
      await dispatch(fetchCartItems());
      console.log('✅ Cart state updated successfully');
    } catch (error) {
      console.error('Error updating cart state:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage = { sender: 'user', text: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setLoading(true);
    
    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input,
          userId: isAuthenticated && user ? user._id : 'guest'
        })
      });
      
      const data = await res.json();
      
      // Create bot message with additional data
      const botMessage = {
        sender: 'bot', 
        text: data.reply || 'Sorry, I could not understand.',
        type: data.type,
        item: data.item,
        showViewCartButton: data.showViewCartButton || false
      };
      
      setMessages((msgs) => [...msgs, botMessage]);
      
      // If item was successfully added to cart, update the cart state
      if (data.type === 'order_success' && data.showViewCartButton) {
        // Small delay to ensure backend has processed the cart update
        setTimeout(async () => {
          await updateCartState();
        }, 500);
      }
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { sender: 'bot', text: 'Error connecting to assistant.' }
      ]);
    }
    
    setInput('');
    setLoading(false);
  };

  // Get placeholder text based on authentication status
  const getPlaceholderText = () => {
    if (!isAuthenticated) {
      return "Please login to order items";
    }
    return "Type your message... (try 'order panipuri')";
  };

  // Get welcome message based on authentication status
  const getWelcomeMessage = () => {
    if (isAuthenticated && user) {
      return `Hi ${user.name}! I am your Help Assistant. How can I help you today?`;
    }
    return 'Hi! I am your Help Assistant. How can I help you today?';
  };

  // Update welcome message when authentication status changes
  useEffect(() => {
    if (messages.length === 1) {
      setMessages([{ sender: 'bot', text: getWelcomeMessage() }]);
    }
  }, [isAuthenticated, user]);

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed',
            bottom: 28,
            right: 28,
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ffb347 0%, #1890ff 100%)',
            color: '#fff',
            border: 'none',
            boxShadow: '0 6px 24px rgba(24,144,255,0.25)',
            zIndex: 1001,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 30,
            transition: 'transform 0.2s, box-shadow 0.2s',
            overflow: 'hidden',
          }}
          aria-label="Open chat assistant"
          onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(24,144,255,0.32)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(24,144,255,0.25)'; }}
        >
          <img src={LOGO_URL} alt="Help" style={{ width: 38, height: 38, borderRadius: '50%', background: '#000', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 28,
            right: 28,
            width: 380,
            maxWidth: '95vw',
            height: 520,
            maxHeight: '80vh',
            background: 'var(--chat-window-bg)',
            borderRadius: 18,
            boxShadow: '0 8px 32px rgba(24,144,255,0.18)',
            zIndex: 1002,
            display: 'flex',
            flexDirection: 'column',
            animation: 'fadeInUp 0.3s',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 18px',
            borderBottom: '1px solid #f0f0f0',
            background: 'var(--header-bg)',
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
          }}>
            <img src={LOGO_URL} alt="Logo" style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 12, background: 'var(--logo-bg)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: 600, fontSize: 18, color: '#1890ff' }}>Help Assistant</span>
              {isAuthenticated && user && (
                <div style={{ fontSize: 12, color: '#666', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <FaUser style={{ fontSize: 10 }} />
                  {user.name}
                </div>
              )}
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', color: '#888', fontSize: 22, cursor: 'pointer' }}
              aria-label="Close chat assistant"
            >
              <FaTimes />
            </button>
          </div>

          {/* Chat Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '18px 12px', background: '#fafdff' }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: 16,
                }}
              >
                {msg.sender === 'bot' && (
                  <img src={LOGO_URL} alt="Logo" style={{ width: 28, height: 28, borderRadius: '50%', marginRight: 8, alignSelf: 'flex-start', background: '#000', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
                )}
                <div
                  style={{
                    background: msg.sender === 'user' ? 'var(--chat-bubble-user)' : 'var(--chat-bubble-bot)',
                    color: msg.sender === 'user' ? '#fff' : 'var(--text-color)',
                    borderRadius: 18,
                    padding: '12px 16px',
                    maxWidth: 280,
                    fontSize: 15,
                    lineHeight: 1.5,
                    boxShadow: msg.sender === 'user' ? '0 2px 8px rgba(24,144,255,0.08)' : '0 2px 8px rgba(0,0,0,0.05)',
                    marginLeft: msg.sender === 'user' ? 32 : 0,
                    marginRight: msg.sender === 'user' ? 0 : 8,
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.sender === 'bot' ? formatBotResponse(msg.text) : msg.text}
                  
                  {/* Show View Cart button for successful orders */}
                  {msg.sender === 'bot' && msg.showViewCartButton && (
                    <div style={{
                      marginTop: 12,
                      paddingTop: 12,
                      borderTop: '1px solid #e8f4fd',
                    }}>
                      <button
                        onClick={handleViewCart}
                        style={{
                          background: 'linear-gradient(135deg, #52c41a 0%, #1890ff 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 12,
                          padding: '8px 16px',
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                        onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(82,196,26,0.3)'; }}
                        onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                      >
                        <FaShoppingCart />
                        View Cart
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                color: '#888', 
                fontSize: 13, 
                marginLeft: 8,
                padding: '8px 12px',
                background: '#f8f9ff',
                borderRadius: 12,
                maxWidth: 120,
              }}>
                <div style={{
                  width: 16,
                  height: 16,
                  border: '2px solid #e8f4fd',
                  borderTop: '2px solid #1890ff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}></div>
                Assistant is typing...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <form
            onSubmit={sendMessage}
            style={{
              display: 'flex',
              alignItems: 'center',
              borderTop: '1px solid #f0f0f0',
              padding: 12,
              background: '#fff',
              borderBottomLeftRadius: 18,
              borderBottomRightRadius: 18,
            }}
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={getPlaceholderText()}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                padding: '10px 14px',
                borderRadius: 12,
                background: '#f5f7fa',
                fontSize: 15,
                marginRight: 8,
              }}
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                background: '#1890ff',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
              }}
              aria-label="Send message"
            >
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
      {/* Animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default Chatbot; 