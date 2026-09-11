import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Screen } from '../types';
import { mockDriver } from '../mockData';
import BottomNav from '../components/BottomNav';

interface Props {
  navigate: (s: Screen) => void;
}

interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  photo: string;
  lastMsg: string;
  time: string;
  unread: number;
  orderId: string | null;
  role: string;
  messages: Message[];
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    name: mockDriver.name,
    photo: mockDriver.photo,
    lastMsg: 'Mwen rive nan adrès la. Mwen la devan!',
    time: '10:18',
    unread: 2,
    orderId: 'LN-2024-0943',
    role: 'Livreur',
    messages: [
      { id: 'm1', sender: 'me', text: 'Bonjou, ki kote ou ye kounye a?', time: '10:12' },
      { id: 'm2', sender: 'them', text: 'Mwen nan wout, mw ap rive nan 5 minit.', time: '10:14' },
      { id: 'm3', sender: 'them', text: 'Mwen rive nan adrès la. Mwen la devan!', time: '10:18' },
    ],
  },
  {
    id: 'c2',
    name: 'Pierre-Louis Duval',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&auto=format',
    lastMsg: 'Pakè a livreye. Mèsi pou konfyans ou!',
    time: 'Yè',
    unread: 0,
    orderId: 'LN-2024-0791',
    role: 'Livreur',
    messages: [
      { id: 'm1', sender: 'them', text: 'Pakè a livreye. Mèsi pou konfyans ou!', time: 'Yè' },
    ],
  },
  {
    id: 'c3',
    name: 'Sipò Livrez-Nou',
    photo: '',
    lastMsg: 'Kòman nou ka ede ou jodi a?',
    time: 'Lendi',
    unread: 0,
    orderId: null,
    role: 'Sèvis Kliyan',
    messages: [
      { id: 'm1', sender: 'them', text: 'Bonjou! Kòman nou ka ede ou jodi a?', time: 'Lendi' },
    ],
  },
];

export default function MessagesScreen({ navigate }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [inputMsg, setInputMsg] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeConv = conversations.find(c => c.id === activeConvId);

  // Otomatikman desann nan dènye mesaj ki voye a
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (activeConvId) {
      scrollToBottom();
    }
  }, [activeConvId, conversations, scrollToBottom]);

  // Louvri yon konvèsasyon epi opoze 'unread' li an 0
  const handleOpenChat = (id: string) => {
    setActiveConvId(id);
    setConversations(prev =>
      prev.map(c => (c.id === id ? { ...c, unread: 0 } : c))
    );
  };

  // Voye yon mesaj epi simule yon repons otomatik (Bot Response)
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || !activeConvId) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userText = inputMsg;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: 'me',
      text: userText,
      time: currentTime,
    };

    setConversations(prev =>
      prev.map(c => {
        if (c.id === activeConvId) {
          return {
            ...c,
            lastMsg: userText,
            time: currentTime,
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    setInputMsg('');

    // Similasyon yon repons an tan reyèl (apre 1.5 segonn)
    setTimeout(() => {
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const replyMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'them',
        text: 'Oki, mwen byen resevwa mesaj ou an!',
        time: replyTime,
      };

      setConversations(prev =>
        prev.map(c => {
          if (c.id === activeConvId) {
            return {
              ...c,
              lastMsg: replyMsg.text,
              time: replyTime,
              messages: [...c.messages, replyMsg],
            };
          }
          return c;
        })
      );
    }, 1500);
  };

  const filteredConvs = conversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.orderId && c.orderId.toLowerCase().includes(search.toLowerCase()))
  );

  const unreadTotal = conversations.reduce((acc, c) => acc + c.unread, 0);

  // ── VUE CHAT (Lè yon konvèsasyon louvri) ──
  if (activeConv) {
    return (
      <div className="h-full flex flex-col bg-slate-50 select-none">
        {/* Top Header Chat */}
        <div className="bg-navy px-4 pt-12 pb-4 flex items-center gap-3 shrink-0 shadow-md">
          <button
            type="button"
            onClick={() => setActiveConvId(null)}
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center border border-white/10"
            aria-label="Retounen nan lis mesaj yo"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="relative shrink-0">
            {activeConv.photo ? (
              <img src={activeConv.photo} alt={activeConv.name} className="w-11 h-11 rounded-2xl object-cover ring-2 ring-white/20" />
            ) : (
              <div className="w-11 h-11 rounded-2xl bg-brand text-white flex items-center justify-center text-xl font-bold shadow-md">
                🆘
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-navy" />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="font-display font-bold text-white text-sm sm:text-base truncate leading-tight">
              {activeConv.name}
            </h2>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <span>{activeConv.role}</span>
              {activeConv.orderId && (
                <>
                  <span>•</span>
                  <span className="text-brand font-mono font-bold">{activeConv.orderId}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bwat Mesaj Yo (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {activeConv.messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] p-3.5 rounded-3xl text-xs sm:text-sm font-medium shadow-sm ${
                  msg.sender === 'me'
                    ? 'bg-brand text-white rounded-br-none'
                    : 'bg-white text-navy border border-slate-100 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-400 font-medium mt-1 px-1">{msg.time}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Chan Antre Mesaj */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0">
          <input
            type="text"
            placeholder="Ekri yon mesaj..."
            value={inputMsg}
            onChange={e => setInputMsg(e.target.value)}
            className="flex-1 h-12 pl-4 pr-4 rounded-2xl bg-slate-50 border border-slate-200 text-navy font-medium text-xs sm:text-sm focus:outline-none focus:border-brand focus:bg-white transition-colors"
          />
          <button
            type="submit"
            disabled={!inputMsg.trim()}
            className="w-12 h-12 rounded-2xl bg-brand text-white flex items-center justify-center shadow-lg shadow-brand/25 active:scale-95 transition-all disabled:opacity-40"
            aria-label="Voye mesaj"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    );
  }

  // ── LIS KONVÈSASYON YO ──
  return (
    <div className="h-full flex flex-col bg-slate-50 select-none">
      {/* Top Header */}
      <div className="bg-navy px-5 pt-12 pb-5 shrink-0 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-display font-black text-white text-xl">Mesaj</h1>
          {unreadTotal > 0 && (
            <span className="px-3 py-1 rounded-full bg-brand text-white text-xs font-bold font-display shadow-md shadow-brand/30">
              {unreadTotal} nouvo
            </span>
          )}
        </div>

        {/* Search Input */}
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Chèche nan mesaj yo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-2xl bg-white/10 border border-white/15 text-white text-xs sm:text-sm placeholder:text-white/40 focus:outline-none focus:bg-white/15 focus:border-brand/50 transition-all"
          />
        </div>
      </div>

      {/* Lis Konvèsasyon */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-28 px-5 pt-4 space-y-2.5">
        {filteredConvs.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="font-display font-bold text-sm">Pa gen mesaj ki koresponn</p>
          </div>
        ) : (
          filteredConvs.map(conv => (
            <button
              key={conv.id}
              type="button"
              onClick={() => handleOpenChat(conv.id)}
              className={`w-full rounded-3xl p-4 flex items-center gap-3.5 border transition-all text-left active:scale-[0.98] ${
                conv.unread > 0
                  ? 'bg-white border-orange-200 shadow-md shadow-orange-500/5'
                  : 'bg-white border-slate-100 shadow-sm hover:border-slate-200'
              }`}
            >
              <div className="relative shrink-0">
                {conv.photo ? (
                  <img src={conv.photo} alt={conv.name} className="w-13 h-13 rounded-2xl object-cover ring-2 ring-slate-100" />
                ) : (
                  <div className="w-13 h-13 rounded-2xl bg-navy text-white flex items-center justify-center text-2xl shadow-inner">
                    🆘
                  </div>
                )}
                {conv.unread > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-brand border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-sm">
                    {conv.unread}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className="font-display font-bold text-navy text-sm truncate">{conv.name}</h3>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-2">{conv.time}</span>
                </div>

                {conv.orderId && (
                  <p className="text-[10px] text-brand font-mono font-bold tracking-tight mb-0.5">
                    {conv.orderId}
                  </p>
                )}

                <p className={`text-xs truncate ${conv.unread > 0 ? 'text-navy font-bold' : 'text-slate-400 font-medium'}`}>
                  {conv.lastMsg}
                </p>
              </div>
            </button>
          ))
        )}
      </div>

      <BottomNav active="messages" navigate={navigate} />
    </div>
  );
}