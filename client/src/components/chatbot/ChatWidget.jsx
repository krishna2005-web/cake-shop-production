// ===========================================
// Chatbot Widget Component
// ===========================================
import { useState, useRef, useEffect } from 'react';
import { HiOutlineChat, HiOutlineX, HiOutlinePaperAirplane } from 'react-icons/hi';
import { chatbotAPI } from '../../services/api';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! 🎂 Welcome to Sweet Delights! I'm your cake assistant. How can I help you today?\n\nYou can ask me about:\n- 🎂 Cake recommendations\n- 💰 Pricing\n- 🎨 Customization\n- 🚗 Delivery",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const { data } = await chatbotAPI.sendMessage({
        message: userMessage,
        history: messages.slice(-6),
      });

      if (data.success) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again! 🎂",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    'Recommend a cake',
    'Birthday cakes',
    'Pricing info',
    'Delivery options',
  ];

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'var(--gradient-primary)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(225, 29, 115, 0.4)',
            zIndex: 999,
            transition: 'transform 0.3s ease',
          }}
          className="animate-bounce-in"
          onMouseOver={(e) => e.target.closest('button').style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.target.closest('button').style.transform = 'scale(1)'}
          aria-label="Open chat"
        >
          <HiOutlineChat size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="animate-fade-in-up card"
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 380,
            maxWidth: 'calc(100vw - 48px)',
            height: 520,
            maxHeight: 'calc(100vh - 48px)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            background: 'var(--gradient-primary)',
            color: 'white',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>🤖</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Cake Assistant</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.9 }}>Always here to help!</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <HiOutlineX size={18} />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div style={{
                  maxWidth: '85%',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user'
                    ? '16px 16px 4px 16px'
                    : '16px 16px 16px 4px',
                  background: msg.role === 'user'
                    ? 'var(--gradient-primary)'
                    : 'var(--color-bg)',
                  color: msg.role === 'user' ? 'white' : 'var(--color-text)',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '12px 18px',
                  borderRadius: '16px 16px 16px 4px',
                  background: 'var(--color-bg)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  gap: 4,
                }}>
                  <span className="animate-float" style={{ animationDelay: '0s' }}>•</span>
                  <span className="animate-float" style={{ animationDelay: '0.2s' }}>•</span>
                  <span className="animate-float" style={{ animationDelay: '0.4s' }}>•</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div style={{
              padding: '0 16px 8px',
              display: 'flex',
              gap: 6,
              flexWrap: 'wrap',
            }}>
              {quickActions.map((action) => (
                <button
                  key={action}
                  onClick={() => {
                    setInput(action);
                    setTimeout(() => {
                      const fakeEvent = { preventDefault: () => {} };
                      setMessages((prev) => [...prev, { role: 'user', content: action }]);
                      setLoading(true);
                      chatbotAPI.sendMessage({ message: action, history: messages.slice(-6) })
                        .then(({ data }) => {
                          if (data.success) {
                            setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
                          }
                        })
                        .catch(() => {
                          setMessages((prev) => [...prev, { role: 'assistant', content: "Sorry, please try again! 🎂" }]);
                        })
                        .finally(() => setLoading(false));
                    }, 100);
                    setInput('');
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 999,
                    border: '1px solid var(--color-primary)',
                    background: 'transparent',
                    color: 'var(--color-primary)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {action}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={sendMessage}
            style={{
              display: 'flex',
              gap: 8,
              padding: '12px 16px',
              borderTop: '1px solid var(--color-border)',
              background: 'var(--color-bg-card)',
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              disabled={loading}
              className="form-input"
              style={{
                flex: 1,
                padding: '10px 14px',
                fontSize: '0.85rem',
                borderRadius: 999,
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              style={{
                background: 'var(--gradient-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                opacity: !input.trim() || loading ? 0.5 : 1,
                transition: 'opacity 0.2s',
                flexShrink: 0,
              }}
            >
              <HiOutlinePaperAirplane size={18} style={{ transform: 'rotate(90deg)' }} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
