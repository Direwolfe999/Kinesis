"use client";

import { AnimatePresence, motion } from "framer-motion";

type Metrics = {
    latency_ms?: number | null;
    billing_enabled?: boolean | null;
    monitoring_series?: number | null;
    capabilities_ok?: boolean | null;
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
                    className="absolute bottom-2 left-2 z-20 w-[calc(100vw-1rem)] rounded-xl border border-white/15 bg-white/5 p-2 backdrop-blur-xl sm:bottom-4 sm:left-3 sm:w-[14rem] sm:rounded-2xl sm:p-3 md:bottom-6 md:left-6 md:w-[19rem]"
                >
                    <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-violet-200">System Diagnostics</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-200">
                        <div className="rounded-lg border border-white/10 bg-black/30 p-2">Latency: {metrics.latency_ms ?? "--"}ms</div>
                        <div className="rounded-lg border border-white/10 bg-black/30 p-2">Monitoring: {metrics.monitoring_series ?? 0}</div>
                        <div className="rounded-lg border border-white/10 bg-black/30 p-2">Billing: {metrics.billing_enabled ? "ON" : "OFF"}</div>
                        <div className="rounded-lg border border-white/10 bg-black/30 p-2">Cost: {metrics.net_cost_cents != null ? `$${(metrics.net_cost_cents / 100).toFixed(2)}` : "--"}</div>
                    </div>
                </motion.section>
            )}
        </AnimatePresence>
    );
}
