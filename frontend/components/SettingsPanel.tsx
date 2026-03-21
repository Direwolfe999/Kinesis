import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ToggleSwitch = ({ label, desc, initial = false }: any) => {
    const [isOn, setIsOn] = useState(initial);
    return (
        <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 group hover:bg-white/[0.01] px-2 rounded-lg transition-colors">
            <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-200">{label}</span>
                {desc && <span className="text-xs text-slate-500 mt-1 max-w-[250px]">{desc}</span>}
            </div>
            <div 
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isOn ? 'bg-blue-500' : 'bg-white/10'}`}
                onClick={() => setIsOn(!isOn)}
            >
                <motion.div 
                    layout 
                    className="w-4 h-4 bg-white rounded-full shadow-md"
                    animate={{ x: isOn ? 20 : 0 }}
                    transition={{ type: "spring" as const, stiffness: 500, damping: 30 }}
                />
            </div>
        </div>
    );
};

export const SettingsPanel = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const } }
    };

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/5 shadow-2xl h-full flex flex-col gap-8 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
            <motion.div variants={itemVariants} className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-3">
                    <span className="bg-white/10 p-2 rounded-lg">⚙️</span> Control Panel
                </h2>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col gap-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Agent Configuration</h3>
                <div className="bg-[#111] border border-white/5 rounded-2xl p-4">
                    <ToggleSwitch label="Autonomous Interventions" desc="Allow agent to merge fixes automatically" initial={true} />
                    <ToggleSwitch label="Verbosity Level" desc="Extended explanation of agent reasoning" />
                    <ToggleSwitch label="System Diagnostics" desc="Run periodic infrastructure sweeps background" initial={true} />
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col gap-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Integrations</h3>
                <div className="bg-[#111] border border-white/5 rounded-2xl p-4">
                    <ToggleSwitch label="GitLab Webhooks" desc="Listen for Push and MR events" initial={true} />
                    <ToggleSwitch label="AWS CloudWatch" desc="Stream performance logs" initial={true} />
                    <ToggleSwitch label="Slack Notifications" desc="Alert #devops on critical issues" />
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col gap-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Theme & Appearance</h3>
                <div className="grid grid-cols-2 gap-3 mt-2">
                    <button className="h-20 bg-[#111] border-2 border-blue-500/50 rounded-xl flex flex-col justify-center items-center gap-2 hover:bg-white/5 transition-colors">
                        <div className="w-5 h-5 rounded-full bg-[#0a0a0a] shadow-inner mb-1" />
                        <span className="text-xs text-white font-medium">Dark Mode (Default)</span>
                    </button>
                    <button className="h-20 bg-white border border-white/10 rounded-xl flex flex-col justify-center items-center gap-2 hover:bg-slate-100 transition-colors opacity-50 cursor-not-allowed">
                        <div className="w-5 h-5 rounded-full bg-slate-200 shadow-inner mb-1" />
                        <span className="text-xs text-slate-800 font-medium">Light Mode</span>
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};
