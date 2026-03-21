import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle,
    XCircle,
    AlertCircle,
    Clock,
    Play,
    Square,
    RotateCcw,
    Bell,
    Moon,
    Sun,
    Search,
    Filter,
    ChevronDown,
    ChevronUp,
    Activity,
    Zap,
    Terminal,
    Sparkles
} from "lucide-react";

// Mock Data
const MOCK_PIPELINES = [
    { id: "pipe-104", name: "Backend Deploy (Prod)", status: "running", triggeredBy: "Jane Doe", duration: "2m 14s", commit: "v2.4.1-rc" },
    { id: "pipe-103", name: "Frontend Test Suite", status: "success", triggeredBy: "Auto (Main)", duration: "4m 50s", commit: "fix/nav-bug" },
    { id: "pipe-102", name: "Data Pipeline Sync", status: "failed", triggeredBy: "John Smith", duration: "12m 04s", commit: "feat/ml-model" },
    { id: "pipe-101", name: "Staging Release", status: "warning", triggeredBy: "Jane Doe", duration: "5m 22s", commit: "chore/deps" },
];

const MOCK_LOGS = [
    "[10:42:01] 🚀 Starting pipeline execution for Backend Deploy (Prod)",
    "[10:42:02] 📦 Fetching repository repository... done.",
    "[10:42:05] 🔍 Running security static analysis (SAST)...",
    "[10:42:15] ✅ No high-severity vulnerabilities found.",
    "[10:42:16] 🔨 Building Docker image backend:v2.4.1-rc...",
    "[10:43:01] 🐋 Step 1/8: FROM python:3.11-slim",
    "[10:43:22] 🐋 Step 4/8: RUN pip install -r requirements.txt",
    "[10:43:55] ⚠️ WARNING: Some dependencies are outdated. Consider updating 'pydantic'.",
    "[10:44:10] ✅ Image built successfully.",
    "[10:44:11] 🚀 Pushing to container registry...",
];

export default function CICDDashboard({ onBack }: { onBack: () => void }) {
    const [darkMode, setDarkMode] = useState(true);
    const [pipelines, setPipelines] = useState(MOCK_PIPELINES);
    const [logs, setLogs] = useState(MOCK_LOGS);
    const [aiOpen, setAiOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeAction, setActiveAction] = useState<string | null>(null);

    // Simulate real-time log streaming
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ⏳ Simulator ticking... processing job tasks.`]);
            }
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleAction = (action: string, id: string) => {
        setActiveAction(`${action}-${id}`);
        setTimeout(() => setActiveAction(null), 1500); // Simulate network request
    };

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case "success": return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle className="w-3.5 h-3.5" /> Success</span>;
            case "running": return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"><Activity className="w-3.5 h-3.5 animate-pulse" /> Running</span>;
            case "failed": return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20"><XCircle className="w-3.5 h-3.5" /> Failed</span>;
            case "warning": return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20"><AlertCircle className="w-3.5 h-3.5" /> Warning</span>;
            default: return null;
        }
    };

    return (
        <div className={`min-h-screen w-full flex flex-col font-sans transition-colors duration-300 ${darkMode ? "bg-[#050505] text-slate-200" : "bg-slate-50 text-slate-900"}`}>

            {/* 1. Header & Navigation */}
            <header className={`sticky top-0 z-50 px-6 py-4 border-b flex items-center justify-between backdrop-blur-md ${darkMode ? "border-white/10 bg-[#050505]/80" : "border-slate-200 bg-white/80"}`}>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">Kinesis</span>
                    </div>

                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <button onClick={onBack} className="hover:text-cyan-400 transition-colors">Workspace</button>
                        <span>/</span>
                        <span className={darkMode ? "text-slate-200" : "text-slate-900"}>CI/CD Pipeline</span>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 rounded-full hover:bg-slate-500/10 transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                    </button>
                    <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-slate-500/10 transition-colors">
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 border-2 border-[#050505] cursor-pointer"></div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 p-6 lg:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-6">

                {/* 2. Top Action Bar & Metrics */}
                <div className="flex flex-col lg:flex-row gap-6 mb-2">
                    <div className="flex-1">
                        <h1 className="text-3xl font-light tracking-tight mb-2">Pipeline Integrity</h1>
                        <p className={darkMode ? "text-slate-400" : "text-slate-500"}>Monitor, manage, and optimize your deployment workflows.</p>
                    </div>

                    <div className="flex gap-4">
                        {/* Mini Metric Cards */}
                        <div className={`px-5 py-3 rounded-2xl border flex flex-col justify-center ${darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm"}`}>
                            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Success Rate</span>
                            <div className="flex items-end gap-2 text-2xl font-light">
                                94.2% <span className="text-sm text-emerald-400 font-medium mb-1">+secondary</span>
                            </div>
                        </div>
                        <div className={`px-5 py-3 rounded-2xl border flex flex-col justify-center ${darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm"}`}>
                            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Carbon Impact</span>
                            <div className="flex items-end gap-2 text-2xl font-light">
                                1.4kg <span className="text-sm text-emerald-400 font-medium mb-1">Optimal</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Column: Pipelines & Analytics (Span 8) */}
                    <div className="lg:col-span-8 flex flex-col gap-6">

                        {/* Pipeline Status Panel */}
                        <section className={`rounded-2xl border overflow-hidden ${darkMode ? "bg-white/5 border-white/10 shadow-lg shadow-black/20" : "bg-white border-slate-200 shadow-sm"}`}>
                            <div className="p-5 border-b border-inherit flex items-center justify-between">
                                <h2 className="text-lg font-medium flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-cyan-500" /> Active Pipelines
                                </h2>
                                <div className="flex items-center gap-3">
                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border ${darkMode ? "bg-black/50 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                                        <Filter className="w-4 h-4 text-slate-500" />
                                        <span className="text-slate-500">All Modules</span>
                                        <ChevronDown className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-cyan-500/20">
                                        Run Pipeline
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className={`text-xs uppercase tracking-wider font-semibold ${darkMode ? "bg-black/20 text-slate-400" : "bg-slate-50 text-slate-500"}`}>
                                        <tr>
                                            <th className="px-6 py-4">Pipeline</th>
                                            <th className="px-6 py-4">Commit</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Duration</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-inherit">
                                        {pipelines.map((pipe) => (
                                            <tr key={pipe.id} className={`group hover:bg-white/[0.02] transition-colors ${darkMode ? "" : "hover:bg-slate-50"}`}>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium">{pipe.name}</div>
                                                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> By {pipe.triggeredBy}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-xs text-slate-400">{pipe.commit}</td>
                                                <td className="px-6 py-4"><StatusBadge status={pipe.status} /></td>
                                                <td className="px-6 py-4 text-slate-400">{pipe.duration}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {pipe.status === "failed" || pipe.status === "warning" ? (
                                                            <button onClick={() => handleAction("retry", pipe.id)} className="p-1.5 rounded hover:bg-slate-500/20 text-slate-400 hover:text-cyan-400 transition-colors" title="Retry">
                                                                <RotateCcw className={`w-4 h-4 ${activeAction === `retry-${pipe.id}` ? "animate-spin text-cyan-500" : ""}`} />
                                                            </button>
                                                        ) : (
                                                            <button onClick={() => handleAction("trigger", pipe.id)} className="p-1.5 rounded hover:bg-slate-500/20 text-slate-400 hover:text-cyan-400 transition-colors" title="Trigger">
                                                                <Play className={`w-4 h-4 ${activeAction === `trigger-${pipe.id}` ? "text-cyan-500 fill-cyan-500" : ""}`} />
                                                            </button>
                                                        )}
                                                        <button onClick={() => handleAction("cancel", pipe.id)} className="p-1.5 rounded hover:bg-slate-500/20 text-slate-400 hover:text-red-400 transition-colors" title="Cancel">
                                                            <Square className={`w-4 h-4 ${activeAction === `cancel-${pipe.id}` ? "text-red-500 fill-red-500" : ""}`} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Job Logs Panel */}
                        <section className={`rounded-2xl border flex flex-col overflow-hidden h-96 ${darkMode ? "bg-black/40 border-slate-800 shadow-inner" : "bg-slate-900 border-slate-800"}`}>
                            <div className="p-3 border-b border-slate-800 flex items-center justify-between text-slate-400 bg-slate-950">
                                <div className="flex items-center gap-3">
                                    <Terminal className="w-4 h-4" />
                                    <span className="text-sm font-mono tracking-wider">LIVE LOGS: Backend Deploy (Prod)</span>
                                </div>
                                <div className="flex items-center gap-2 bg-black/50 px-2 py-1 rounded border border-slate-800">
                                    <Search className="w-3.5 h-3.5" />
                                    <input
                                        type="text"
                                        placeholder="Filter logs..."
                                        className="bg-transparent border-none outline-none text-xs w-32 font-mono"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex-1 p-4 overflow-y-auto font-mono text-[13px] leading-relaxed hide-scrollbar">
                                {logs.filter(l => l.toLowerCase().includes(searchQuery.toLowerCase())).map((log, i) => {
                                    const isWarning = log.includes("WARNING");
                                    const isError = log.includes("ERROR");
                                    const isSuccess = log.includes("✅");
                                    return (
                                        <div key={i} className={`mb-1 hover:bg-white/[0.02] px-1 rounded transition-colors ${isWarning ? "text-amber-400" : isError ? "text-red-400" : isSuccess ? "text-emerald-400" : "text-slate-300"
                                            }`}>
                                            {log}
                                        </div>
                                    )
                                })}
                                {/* Auto-scroll anchor anchor */}
                                <div className="h-4"></div>
                            </div>
                        </section>

                    </div>

                    {/* Right Column: AI Insights & Resources (Span 4) */}
                    <div className="lg:col-span-4 flex flex-col gap-6">

                        {/* AI Suggestions Panel */}
                        <section className={`rounded-2xl border overflow-hidden transition-all duration-300 ${darkMode ? "bg-gradient-to-b from-blue-900/10 to-indigo-900/5 border-blue-500/20" : "bg-blue-50 border-blue-100"}`}>
                            <div
                                className="p-5 border-b border-inherit flex items-center justify-between cursor-pointer"
                                onClick={() => setAiOpen(!aiOpen)}
                            >
                                <h2 className="text-lg font-medium flex items-center gap-2 text-cyan-400">
                                    <Sparkles className="w-5 h-5" /> AI Pipeline Optimizations
                                </h2>
                                {aiOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                            </div>

                            <AnimatePresence>
                                {aiOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="p-5 pt-0 mt-5"
                                    >
                                        <div className="space-y-4">
                                            <div className={`p-4 rounded-xl border ${darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200"}`}>
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 mt-0.5">
                                                        <Zap className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-sm mb-1">Caching Optimization</h4>
                                                        <p className="text-xs text-slate-500 leading-relaxed">
                                                            Your Node modules step is taking 45% of pipeline time. Implementing a persistent cache layer could reduce build times by ~2m.
                                                        </p>
                                                        <button className="mt-3 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
                                                            Apply Recommendation →
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`p-4 rounded-xl border ${darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200"}`}>
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
                                                        <CheckCircle className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-sm mb-1">Image Size Reduction</h4>
                                                        <p className="text-xs text-slate-500 leading-relaxed">
                                                            Consider using Distroless images for production deploy. It will reduce container attack surface and save 120MB per build.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </section>

                        {/* Environment/Resource Status */}
                        <section className={`rounded-2xl border p-5 ${darkMode ? "bg-white/5 border-white/10" : "bg-white border-slate-200 shadow-sm"}`}>
                            <h2 className="text-base font-medium mb-4 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-purple-400" /> Infrastructure Runners
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-400">linux-amd64-large (Auto-scaling)</span>
                                        <span className="font-medium">4/10 active</span>
                                    </div>
                                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                        <div className="h-full bg-cyan-400 rounded-full w-[40%]"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-400">linux-arm64-standard</span>
                                        <span className="font-medium">8/10 active</span>
                                    </div>
                                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                        <div className="h-full bg-amber-400 rounded-full w-[80%]"></div>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>
            </main>
        </div>
    );
}

