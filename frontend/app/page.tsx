"use client";

import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import WarRoom from "../components/WarRoom";
import SettingsDashboard from "../components/SettingsDashboard";
import { Sidebar } from "../components/Sidebar";
import { FloatingActions } from "../components/FloatingActions";
import { ToastProvider, useToast } from "../components/ToastProvider";
import CICDDashboard from "../components/CICDDashboard";
import SecurityDashboard from "../components/SecurityDashboard";
import CloudDashboard from "../components/CloudDashboard";
import GlobalCommandDashboard from "../components/GlobalCommandDashboard";
import DevOpsControlCenter from "../components/DevOpsControlCenter";


function DashboardContent() {
    const [activeView, setActiveView] = useState<string>("dashboard");
    const { addToast } = useToast();

    const renderSecondaryView = () => {
        if (activeView === "warroom") {
            return (
                <div className="relative min-h-screen w-full">
                    <button
                        onClick={() => setActiveView("dashboard")}
                        className="absolute top-6 left-6 z-[100] rounded-lg border border-cyan-500/30 bg-black/50 px-4 py-2 text-xs uppercase tracking-widest text-cyan-300 backdrop-blur-md transition-all hover:bg-cyan-500/20"
                    >
                        ← Back to Control Plane
                    </button>
                    <WarRoom />
                </div>
            );
        }
        if (activeView === "devops") {
            return (
                <div className="relative min-h-screen w-full">
                    <DevOpsControlCenter onBack={() => setActiveView("dashboard")} />
                </div>
            );
        }
        if (activeView === "pipelines") {
            return (
                <div className="relative min-h-screen w-full">
                    <CICDDashboard onBack={() => setActiveView("dashboard")} />
                </div>
            );
        }
        if (activeView === "security") {
            return (
                <div className="relative min-h-screen w-full">
                    <SecurityDashboard onBack={() => setActiveView("dashboard")} />
                </div>
            );
        }
        if (activeView === "settings") { return <div className="relative min-h-screen w-full"><SettingsDashboard onBack={() => setActiveView("dashboard")} /></div>; }
        if (activeView === "cloud") { return <div className="relative min-h-screen w-full"><CloudDashboard onBack={() => setActiveView("dashboard")} /></div>; }
        return null;
    };

    return (
        <main className="relative min-h-screen bg-[#050505] text-slate-200 overflow-x-hidden font-sans flex">
            {/* Sidebar Navigation */}
            {(activeView !== "warroom" && activeView !== "pipelines" && activeView !== "security" && activeView !== "cloud" && activeView !== "settings" && activeView !== "devops") && <Sidebar activeView={activeView} setActiveView={setActiveView} />}

            {/* Floating Action Button */}
            {(activeView !== "warroom" && activeView !== "pipelines" && activeView !== "security" && activeView !== "cloud" && activeView !== "settings" && activeView !== "devops") && <FloatingActions addToast={addToast} />}

            {/* Main Content Area - padded left for sidebar */}
            <div className={`flex-1 transition-all duration-300 ${activeView !== 'warroom' && activeView !== 'pipelines' && activeView !== 'security' && activeView !== 'cloud' && activeView !== 'settings' ? 'ml-20' : ''}`}>
                
                {/* Background Effects */}
                <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(6,182,212,0.15),transparent_50%)] pointer-events-none" />
                <div className="fixed inset-0 flex z-0 pointer-events-none items-center justify-center opacity-[0.05]">
                    <img src="/logos/full.png" alt="SynAegis Full Motif" className="w-[800px] h-[800px] object-contain grayscale blur-[2px]" />
                </div>
                <div className="fixed inset-0 pointer-events-none opacity-20 z-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

                {activeView === "warroom" || activeView === "pipelines" || activeView === "security" ? (
                    renderSecondaryView()
                ) : (
                    <div className="relative z-10 mx-auto max-w-[1500px] px-4 py-8 mb-32 sm:px-8 flex flex-col gap-8">
                        {/* Breadcrumbs for internal navigation */}
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 tracking-widest pl-2">
                            <span className="hover:text-cyan-400 cursor-pointer transition-colors" onClick={() => setActiveView('dashboard')}>SYNAEGIS</span>
                            <span>/</span>
                            <span className="text-cyan-300 uppercase">{activeView}</span>
                        </div>

                        {activeView !== "dashboard" ? renderSecondaryView() : (
                            <GlobalCommandDashboard setActiveView={setActiveView} />
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}

export default function DashboardPage() {
    return (
        <ToastProvider>
            <DashboardContent />
        </ToastProvider>
    );
}
