import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ToastType = 'success' | 'error' | 'info' | 'warn';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within ToastProvider");
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
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
        </ToastContext.Provider>
    );
};
