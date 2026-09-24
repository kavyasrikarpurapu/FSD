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
            // Load user data
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
      const res = await api.get(`/messages/${partnerId}`);
      if (res.success) {
        setMessages(res.messages || []);
      }
    } catch (err) {
      console.error('Fetch messages error:', err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [targetUserId]);

  useEffect(() => {
    if (activeUser?._id) {
      fetchMessages(activeUser._id);
      const interval = setInterval(() => fetchMessages(activeUser._id), 5000);
      return () => clearInterval(interval);
    }
  }, [activeUser?._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeUser?._id) return;

    setSending(true);
    const messageToSend = inputText.trim();
    setInputText('');

    try {
      const res = await api.post('/messages', {
        receiverId: activeUser._id,
        text: messageToSend,
        jobId: jobId || undefined,
        contractId: contractId || undefined
      });

      if (res.success && res.message) {
        setMessages(prev => [...prev, res.message]);
        fetchConversations();
      }
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl h-[750px] grid grid-cols-1 md:grid-cols-3">
        
        {/* Conversations Sidebar */}
        <div className="border-r border-slate-800 flex flex-col bg-slate-950/40">
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              <span>Direct Messages</span>
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No conversations yet. Reach out to any client or freelancer to begin!
              </div>
            ) : (
              conversations.map((c) => {
                const isSelected = activeUser?._id === c.user?._id;
                return (
                  <div
                    key={c.user?._id}
                    onClick={() => setActiveUser(c.user)}
                    className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${
                      isSelected ? 'bg-indigo-950/40 border-l-4 border-indigo-500' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <img
                      src={c.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.user?.name}`}
                      alt={c.user?.name}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white truncate">{c.user?.name}</h4>
                        <span className="text-[10px] text-slate-500">
                          {c.lastMessageDate ? new Date(c.lastMessageDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{c.lastMessage || 'Connected'}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Thread Area */}
        <div className="md:col-span-2 flex flex-col bg-slate-900/60">
          
          {activeUser ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
                <div className="flex items-center gap-3">
                  <img
                    src={activeUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeUser.name}`}
                    alt={activeUser.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">{activeUser.name}</h3>
                    <p className="text-xs text-indigo-300">{activeUser.title || activeUser.role}</p>
                  </div>
                </div>
              </div>

              {/* Messages Content */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-20 text-xs text-slate-500">
                    This is the start of your message history with <strong className="text-white">{activeUser.name}</strong>.
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMe = m.sender?._id === user?._id || m.sender === user?._id;
                    return (
                      <div key={m._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md p-3.5 rounded-2xl text-xs ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-br-sm shadow-glow'
                            : 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700/80'
                        }`}>
                          <p className="leading-relaxed whitespace-pre-line">{m.text}</p>
                          <span className={`text-[10px] block mt-1.5 ${isMe ? 'text-indigo-200' : 'text-slate-500'} text-right`}>
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 flex items-center gap-3 bg-slate-900">
                <input
                  type="text"
                  placeholder={`Message ${activeUser.name}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={sending || !inputText.trim()}
                  className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-glow transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-2">
              <MessageSquare className="w-12 h-12 text-slate-700" />
              <p className="text-sm font-semibold text-slate-400">Select a conversation to start chatting</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default MessagesPage;
