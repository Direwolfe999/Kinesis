"use client";
import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ToastType = 'success' | 'error' | 'info' | 'warn';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

export interface ModalOptions { title: string; content: React.ReactNode; }
interface ToastContextType {
    addToast: (message: string, type?: ToastType) => void;
    showModal: (options: ModalOptions) => void;
    closeModal: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within ToastProvider");
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [modal, setModal] = useState<ModalOptions | null>(null);

    const showModal = useCallback((options: ModalOptions) => setModal(options), []);
    const closeModal = useCallback(() => setModal(null), []);

    const addToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, showModal, closeModal }}>
            {children}
            <div className="fixed top-8 right-8 z-[300] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.9 }}
                            className={`px-5 py-3 rounded-xl border backdrop-blur-xl shadow-2xl pointer-events-auto flex items-center gap-3 ${
                                toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                                toast.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                                toast.type === 'warn' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' :
                                'bg-blue-500/10 border-blue-500/30 text-blue-400'
                            }`}
                        >
                            <span className="text-lg">
                                {toast.type === 'success' && '✅'}
                                {toast.type === 'error' && '❌'}
                                {toast.type === 'warn' && '⚠️'}
                                {toast.type === 'info' && '💎'}
                            </span>
                            <span className="font-medium text-sm text-white/90">{toast.message}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        
            {modal && (
                <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 pointer-events-auto">
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="w-full max-w-md rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden flex flex-col font-sans">
                        <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h3 className="font-semibold text-lg text-slate-100">{modal.title}</h3>
                            <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white">✕</button>
                        </div>
                        <div className="p-6 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
                            {modal.content}
                        </div>
                        <div className="px-5 py-4 border-t border-white/10 bg-white/5 flex gap-3 justify-end items-center">
                            <button onClick={closeModal} className="px-4 py-2 rounded-lg font-medium bg-white text-black hover:bg-slate-200 transition-colors shadow-lg">Acknowledge</button>
                        </div>
                    </motion.div>
                </div>
            )}
    
        </ToastContext.Provider>
    );
};
