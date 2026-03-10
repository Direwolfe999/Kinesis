"use client";

import { AnimatePresence, motion } from "framer-motion";

type Props = {
    active: boolean;
    videoRef: React.RefObject<HTMLVideoElement | null>;
};

export default function OpticalFeed({ active, videoRef }: Props) {
    return (
        <AnimatePresence>
            {active && (
                <motion.section
                    initial={{ opacity: 0, y: -14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    className="pointer-events-none absolute left-2 top-2 z-20 w-[9rem] rounded-xl border border-white/15 bg-white/5 p-1.5 backdrop-blur-xl sm:left-3 sm:top-3 sm:w-[12rem] sm:rounded-2xl sm:p-2 md:left-5 md:top-5 md:w-[18rem]"
                >
                    <div className="relative overflow-hidden rounded-xl border border-white/10">
                        <video ref={videoRef} muted playsInline className="h-20 w-full bg-black object-cover sm:h-28 md:h-40" />
                        <div className="scanline absolute inset-0" />
                    </div>
                    <p className="mt-0.5 text-[8px] uppercase tracking-[0.18em] text-cyan-200/90 sm:mt-1 sm:text-[9px] md:text-[10px] md:tracking-[0.22em]">Optical Feed</p>
                </motion.section>
            )}
        </AnimatePresence>
    );
}
