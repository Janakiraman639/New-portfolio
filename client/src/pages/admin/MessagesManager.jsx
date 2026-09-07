import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Mail, Trash2, Check, ExternalLink, Calendar, User, Eye, X, Loader2 } from 'lucide-react';

const MessagesManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/messages');
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await api.put(`/admin/messages/${id}/read`);
      fetchMessages();
      if (selectedMsg && selectedMsg.id === id) {
        setSelectedMsg((prev) => ({ ...prev, isRead: true }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/admin/messages/${id}`);
      fetchMessages();
      if (selectedMsg && selectedMsg.id === id) {
        setSelectedMsg(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Mail className="w-6 h-6 text-cyan-400" /> Contact Messages Inbox
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Review inquiries, project proposals, and messages submitted from the portfolio contact form.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" /> Loading inbox messages...
        </div>
      ) : messages.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center text-slate-400 text-sm space-y-2 border border-slate-800">
          <Mail className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="font-bold text-slate-300">Your Inbox is Empty</p>
          <p className="text-xs text-slate-500">Visitor messages submitted from the public contact form will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => {
                setSelectedMsg(msg);
                if (!msg.isRead) handleMarkRead(msg.id);
              }}
              className={`glass-card p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:-translate-y-0.5 ${
                !msg.isRead ? 'border-cyan-500/50 bg-slate-900/80 shadow-md shadow-cyan-500/10' : 'border-slate-800 opacity-90'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {!msg.isRead && (
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                  )}
                  <h3 className="font-bold text-slate-100 text-sm">{msg.name}</h3>
                  <span className="text-slate-500 text-xs font-mono">({msg.email})</span>
                </div>
                <p className="text-slate-300 text-xs font-medium">{msg.subject || 'No Subject'}</p>
                <p className="text-slate-400 text-xs line-clamp-1">{msg.message}</p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                <span className="text-[11px] text-slate-500 font-mono">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(msg.id);
                  }}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-rose-400 border border-slate-800"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Reader Modal */}
      {selectedMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-card max-w-lg w-full p-6 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <h3 className="font-bold text-slate-100 text-lg">{selectedMsg.subject || 'Website Inquiry'}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" /> {selectedMsg.name} ({selectedMsg.email})
                </p>
              </div>
              <button onClick={() => setSelectedMsg(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono text-slate-500 block">
                Received on: {new Date(selectedMsg.createdAt).toLocaleString()}
              </span>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                {selectedMsg.message}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => handleDelete(selectedMsg.id)}
                className="px-3 py-1.5 rounded-xl bg-rose-950/60 text-rose-400 text-xs font-semibold border border-rose-800/60 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>

              <a
                href={`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(selectedMsg.subject || 'Portfolio Inquiry')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/30 flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesManager;
