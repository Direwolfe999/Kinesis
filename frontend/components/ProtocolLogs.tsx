"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";

type Props = {
    logs: string[];
};

export default function ProtocolLogs({ logs }: Props) {
    const endRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [logs]);

    return (
        <AnimatePresence>
            {logs.length > 0 && (
                <motion.section
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 24 }}
                    className="absolute bottom-2 right-2 z-40 h-[30vh] w-[calc(100vw-1rem)] rounded-xl border border-white/15 bg-white/5 p-2 backdrop-blur-xl sm:bottom-auto sm:right-3 sm:top-3 sm:h-[45vh] sm:w-[16rem] sm:rounded-2xl sm:p-3 md:right-6 md:top-6 md:h-[65vh] md:w-[23rem]"
                >
                    <div className="mb-2 flex items-center justify-between">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-200">Protocol Logs</p>
                        <button
                            onClick={() => navigator.clipboard.writeText(logs.join('\\n'))}
                            className="rounded border border-white/20 bg-white/5 px-2 py-0.5 text-[9px] uppercase tracking-wider text-slate-300 hover:bg-white/10"
                        >
                            Copy
                        </button>
                    </div>
                    <div className="h-[calc(30vh-2.5rem)] overflow-y-auto rounded-lg border border-white/10 bg-black/40 p-1.5 text-[10px] text-slate-300 sm:h-[calc(45vh-2.5rem)] sm:p-2 sm:text-xs md:h-[calc(65vh-2.5rem)]">
                        {logs.map((line, i) => {
                            const isInfo = line.toLowerCase().includes("info") || line.toLowerCase().includes("ok");
                            const isError = line.toLowerCase().includes("error") || line.toLowerCase().includes("fail");
                            
                            let colorClass = "text-slate-300";
                            if (isInfo) colorClass = "bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(59,130,246,0.3)] font-semibold";
                            if (isError) colorClass = "text-red-400 font-bold";
                            
                            return (
                                <p key={`${i}-${line.slice(0, 12)}`} className={`mb-1 font-mono leading-relaxed tracking-wide ${colorClass}`}>
                                    {line}
                                </p>
                            );
                        })}
                        <div ref={endRef} />
                    </div>
                </motion.section>
            )}
        </AnimatePresence>
    );
}
