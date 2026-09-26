import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, MessageSquare, User, Clock, CheckCheck, Sparkles } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const MessagesPage = () => {
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get('userId');
  const jobId = searchParams.get('jobId');
  const contractId = searchParams.get('contractId');

  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Fetch conversations list
  const fetchConversations = async () => {
    try {
      const res = await api.get('/messages/conversations/list');
      if (res.success) {
        setConversations(res.conversations || []);
        
        // If targetUserId specified from query params, fetch profile if not in list
        if (targetUserId) {
          const found = res.conversations.find(c => c.user?._id === targetUserId);
          if (found) {
            setActiveUser(found.user);
          } else {
            const userRes = await api.get(`/freelancers/${targetUserId}`).catch(() => null);
            if (userRes && userRes.success && userRes.freelancer) {
              setActiveUser(userRes.freelancer);
            }
          }
        } else if (res.conversations.length > 0 && !activeUser) {
          setActiveUser(res.conversations[0].user);
        }
      }
    } catch (err) {
      console.error('Conversations error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch messages for active user
  const fetchMessages = async (partnerId) => {
    if (!partnerId) return;
    try {
      const res = await api.get(`/messages/conversation/${partnerId}`);
      if (res.success) {
        setMessages(res.messages || []);
        setTimeout(scrollToBottom, 50);
      }
    } catch (err) {
      console.error('Messages error:', err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [targetUserId]);

  useEffect(() => {
    if (activeUser?._id) {
      fetchMessages(activeUser._id);
      const interval = setInterval(() => fetchMessages(activeUser._id), 4000);
      return () => clearInterval(interval);
    }
  }, [activeUser?._id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeUser?._id || sending) return;

    setSending(true);
    const tempText = inputText;
    setInputText('');

    try {
      const res = await api.post('/messages', {
        receiverId: activeUser._id,
        content: tempText,
        jobId: jobId || undefined,
        contractId: contractId || undefined
      });

      if (res.success) {
        setMessages((prev) => [...prev, res.message]);
        setTimeout(scrollToBottom, 50);
        fetchConversations();
      }
    } catch (err) {
      console.error('Send error:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl overflow-hidden shadow-warm-xl grid grid-cols-1 md:grid-cols-12 min-h-[620px]">
        
        {/* Left Side: Conversation Threads */}
        <div className="md:col-span-4 border-r border-[#E5D7C5] flex flex-col bg-[#F4E8D5]/40">
          <div className="p-5 border-b border-[#E5D7C5] flex items-center justify-between">
            <h2 className="text-base font-bold text-[#3B3028] font-display flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#16A085]" />
              <span>Direct Messages</span>
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#E5D7C5]">
            {loading ? (
              <div className="p-8 text-center text-xs text-[#75685C]">
                Loading conversation threads...
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#75685C] space-y-2">
                <p>No active conversations yet.</p>
                <p className="text-[11px] text-[#9C8E80]">Messages start automatically when hiring or proposing.</p>
              </div>
            ) : (
              conversations.map((c) => {
                const isSelected = activeUser?._id === c.user?._id;
                return (
                  <button
                    key={c.user?._id}
                    onClick={() => setActiveUser(c.user)}
                    className={`w-full p-4 text-left transition-colors flex items-start gap-3 ${
                      isSelected ? 'bg-[#FFFDF8] border-l-4 border-l-[#16A085]' : 'hover:bg-[#F4E8D5]/80'
                    }`}
                  >
                    <img
                      src={c.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.user?.name}`}
                      alt={c.user?.name}
                      className="w-10 h-10 rounded-xl object-cover border border-[#E5D7C5] bg-[#FFFDF8]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="font-bold text-xs text-[#3B3028] truncate">{c.user?.name}</h4>
                        <span className="text-[10px] text-[#9C8E80]">
                          {c.lastMessage?.createdAt && new Date(c.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-[#75685C] truncate">
                        {c.lastMessage?.content || 'Started conversation'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Active Chat View */}
        <div className="md:col-span-8 flex flex-col bg-[#FFFDF8]">
          {activeUser ? (
            <>
              {/* Partner Header */}
              <div className="p-4 sm:p-5 border-b border-[#E5D7C5] flex items-center justify-between bg-[#FFFDF8]">
                <div className="flex items-center gap-3">
                  <img
                    src={activeUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeUser.name}`}
                    alt={activeUser.name}
                    className="w-10 h-10 rounded-xl object-cover border border-[#E5D7C5] bg-[#F4E8D5]"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-[#3B3028] font-display">{activeUser.name}</h3>
                    <p className="text-xs text-[#16A085] font-semibold">{activeUser.title || activeUser.role}</p>
                  </div>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[480px]">
                {messages.length === 0 ? (
                  <div className="py-20 text-center text-xs text-[#75685C]">
                    Start the discussion with {activeUser.name} regarding deliverables, milestones, or questions.
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMine = m.sender?._id === user?._id || m.sender === user?._id;
                    return (
                      <div
                        key={m._id}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                            isMine
                              ? 'bg-[#16A085] text-white rounded-br-none shadow-sm'
                              : 'bg-[#F4E8D5] text-[#3B3028] rounded-bl-none border border-[#E5D7C5]'
                          }`}
                        >
                          {m.content}
                        </div>
                        <span className="text-[10px] text-[#9C8E80] mt-1 px-1">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-[#E5D7C5] flex items-center gap-2 bg-[#FFFDF8]">
                <input
                  type="text"
                  placeholder={`Write a message to ${activeUser.name}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#3B3028] placeholder-[#9C8E80] focus:outline-none focus:border-[#16A085]"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || sending}
                  className="btn-primary py-2.5 px-5 text-xs font-bold shadow-warm-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#75685C] space-y-2">
              <MessageSquare className="w-10 h-10 text-[#D5C3AE]" />
              <h3 className="font-bold text-base text-[#3B3028] font-display">No Conversation Selected</h3>
              <p className="text-xs">Choose a message thread on the left to view notes and chats.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MessagesPage;
