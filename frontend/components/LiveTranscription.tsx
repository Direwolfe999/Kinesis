"use client";

import { AnimatePresence, motion } from "framer-motion";

type Props = {
    text: string;
};

export default function LiveTranscription({ text }: Props) {
    return (
        <AnimatePresence>
            {text && (
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 0.64, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="pointer-events-none absolute bottom-24 left-1/2 z-30 w-[min(80vw,48rem)] -translate-x-1/2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-center text-lg text-slate-200 backdrop-blur-lg"
                >
                    {text}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
