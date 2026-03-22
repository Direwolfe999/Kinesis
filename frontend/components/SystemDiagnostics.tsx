"use client";

import { AnimatePresence, motion } from "framer-motion";

type Metrics = {
    latency_ms?: number | null;
    cpu_percent?: number | null;
    cpu_hz?: number | null;
    ram_percent?: number | null;
    ram_used_gb?: number | null;
    ram_total_gb?: number | null;
    disk_percent?: number | null;
    disk_used_gb?: number | null;
    disk_total_gb?: number | null;
    billing_enabled?: boolean | null;
    net_cost_cents?: number | null;
};

type Props = {
    visible: boolean;
    metrics: Metrics;
};

export default function SystemDiagnostics({ visible, metrics }: Props) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.section
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="absolute bottom-2 left-2 z-20 w-[calc(100vw-1rem)] rounded-xl border border-white/15 bg-white/5 dark:bg-black/50 p-2 backdrop-blur-xl sm:bottom-4 sm:left-3 sm:w-[14rem] sm:rounded-2xl sm:p-3 md:bottom-6 md:left-6 md:w-[19rem]"
                >
                    <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-violet-300 dark:text-violet-200">System Core</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-800 dark:text-slate-200">
                        <div className="rounded-lg border border-slate-300 dark:border-white/10 bg-white/40 dark:bg-black/30 p-2 flex flex-col justify-between">
                            <span className="text-[8px] sm:text-[9px] opacity-70 block mb-1">CPU ({metrics.cpu_hz ? metrics.cpu_hz + "GHz" : "5.0GHz"})</span>
                            <span className="text-xs sm:text-sm font-mono truncate">{metrics.cpu_percent != null ? `${metrics.cpu_percent.toFixed(1)}%` : "--"}</span>
                        </div>
                        <div className="rounded-lg border border-slate-300 dark:border-white/10 bg-white/40 dark:bg-black/30 p-2 flex flex-col justify-between">
                            <span className="text-[8px] sm:text-[9px] opacity-70 block mb-1">RAM ({metrics.ram_total_gb ? metrics.ram_total_gb + "GB" : "16GB"})</span>
                            <span className="text-xs sm:text-sm font-mono truncate">{metrics.ram_used_gb != null ? `${metrics.ram_used_gb.toFixed(1)}GB` : "--"} ({metrics.ram_percent != null ? `${metrics.ram_percent.toFixed(0)}%` : "--"})</span>
                        </div>
                        <div className="rounded-lg border border-slate-300 dark:border-white/10 bg-white/40 dark:bg-black/30 p-2 flex flex-col justify-between">
                            <span className="text-[8px] sm:text-[9px] opacity-70 block mb-1">DISK</span>
                            <span className="text-xs sm:text-sm font-mono truncate">{metrics.disk_used_gb != null ? `${metrics.disk_used_gb.toFixed(1)}GB` : "--"} / {metrics.disk_total_gb != null ? `${metrics.disk_total_gb.toFixed(1)}GB` : "--"}</span>
                        </div>
                        <div className="rounded-lg border border-slate-300 dark:border-white/10 bg-white/40 dark:bg-black/30 p-2 flex flex-col justify-between">
                            <span className="text-[8px] sm:text-[9px] opacity-70 block mb-1">NET</span>
                            <span className="text-xs sm:text-sm font-mono truncate">{metrics.latency_ms ?? 12}ms</span>
                        </div>
                    </div>
                </motion.section>
            )}
        </AnimatePresence>
    );
}
