import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LiveAgent = () => {
    const [messages, setMessages] = useState([
        { id: 1, sender: "SynAegis", text: "Systems online. Monitoring active repositories and infrastructure. How can I assist you today?", time: "09:00 AM", type: "system" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newUserMsg = { id: Date.now(), sender: "Operator", text: input, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), type: "user" };
        setMessages(prev => [...prev, newUserMsg]);
        setInput("");
        setIsTyping(true);

        // Mock Agent Response
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: Date.now() + 1, sender: "SynAegis", 
                text: "Acknowledged. Initiating diagnostic scan protocol on requested vectors...", 
                time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
                type: "system"
            }]);
        }, 1500);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col h-full bg-[#0a0a0a] rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"></div>
            
            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/[0.01] backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/30">
                        <span className="text-xl">🤖</span>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#0a0a0a] rounded-full"></span>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white tracking-tight">SynAegis Core</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-blue-400 animate-pulse">●</span>
                            <span className="text-xs text-slate-400 font-mono">Listening on port 8080</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 pb-24 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div 
                            key={msg.id}
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className={`flex flex-col max-w-[85%] ${msg.type === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                        >
                            <div className="flex items-center gap-2 mb-1.5 px-1">
                                <span className="text-xs font-medium text-slate-400">{msg.sender}</span>
                                <span className="text-[10px] text-slate-600 font-mono">{msg.time}</span>
                            </div>
                            <div className={`p-4 rounded-2xl text-sm leading-relaxed backdrop-blur-sm ${
                                msg.type === 'user' 
                                ? 'bg-blue-600/20 text-blue-50 border border-blue-500/30 rounded-tr-sm' 
                                : 'bg-white/[0.03] text-slate-300 border border-white/5 rounded-tl-sm'
                            }`}>
                                {msg.text}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                
                {isTyping && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-2 max-w-[80%] bg-white/[0.02] border border-white/5 p-4 rounded-2xl rounded-tl-sm text-sm text-slate-400 backdrop-blur-sm w-fit mr-auto"
                    >
                        <span className="text-blue-400 font-mono text-xs">SynAegis is processing</span>
                        <div className="flex gap-1">
                            <motion.span animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-blue-400 rounded-full"/>
                            <motion.span animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-blue-400 rounded-full"/>
                            <motion.span animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-blue-400 rounded-full"/>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent">
                <form onSubmit={handleSend} className="relative flex items-center group">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Command SynAegis (e.g. 'Deploy staging update...')"
                        className="w-full bg-[#121212] text-white text-sm placeholder:text-slate-500 px-5 py-4 rounded-xl border border-white/10 outline-none focus:border-blue-500/50 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all z-10 font-mono"
                    />
                    <button 
                        type="submit" 
                        disabled={!input.trim()}
                        className="absolute right-2 z-20 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center"
                    >
                        <svg className="w-4 h-4 translate-x-px translate-y-px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                </form>
            </div>
        </motion.div>
    );
};
