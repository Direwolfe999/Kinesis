"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import KinesisOrb, { type OrbState } from "../components/KinesisOrb";
import LiveTranscription from "../components/LiveTranscription";
import OpticalFeed from "../components/OpticalFeed";
import ProtocolLogs from "../components/ProtocolLogs";
import SystemDiagnostics from "../components/SystemDiagnostics";

type WsEvent =
    | { type: "ready"; sessionId: string; startup?: Record<string, unknown> }
    | { type: "agent_text"; text: string }
    | { type: "agent_audio"; mimeType: string; data: string }
    | { type: "audio_frequency"; value: number }
    | { type: "brain_log"; level: string; message: string }
    | { type: "system_metrics"; metrics: Record<string, unknown> }
    | { type: "barge_in_ack" }
    | { type: "error"; message: string };

type Metrics = {
    latency_ms?: number | null;
    billing_enabled?: boolean | null;
    monitoring_series?: number | null;
    capabilities_ok?: boolean | null;
    net_cost_cents?: number | null;
};

const FRAME_INTERVAL_MS = 450;
const RECONNECT_MIN_MS = 600;

function toBase64(buffer: ArrayBufferLike): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const stride = 0x8000;
    for (let i = 0; i < bytes.length; i += stride) {
        binary += String.fromCharCode(...bytes.subarray(i, i + stride));
    }
    return btoa(binary);
}

function base64ToBlob(data: string, mimeType: string): Blob {
    const raw = atob(data);
    const arr = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
    return new Blob([arr], { type: mimeType });
}

function floatToPcm16(float32: Float32Array): Int16Array {
    const out = new Int16Array(float32.length);
    for (let i = 0; i < float32.length; i++) {
        const s = Math.max(-1, Math.min(1, float32[i]));
        out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return out;
}

export default function HomePage() {
    const [orbState, setOrbState] = useState<OrbState>("idle");
    const [rippling, setRippling] = useState(false);
    const [userLevel, setUserLevel] = useState(0.1);
    const [aiLevel, setAiLevel] = useState(0.08);
    const [logs, setLogs] = useState<string[]>([]);
    const [transcript, setTranscript] = useState("");
    const [metrics, setMetrics] = useState<Metrics>({});
    const [cameraActive, setCameraActive] = useState(false);
    const [showDiag, setShowDiag] = useState(true);
    const [hovering, setHovering] = useState(false);

    const wsRef = useRef<WebSocket | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const mediaRef = useRef<MediaStream | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const frameTimerRef = useRef<number | null>(null);
    const reconnectAttemptsRef = useRef(0);
    const manualDisconnectRef = useRef(false);
    const transcriptionTimerRef = useRef<number | null>(null);

    const wsUrl = useMemo(() => {
        const fallback =
            typeof window !== "undefined"
                ? `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.hostname}:8080/ws/kinesis`
                : "ws://localhost:8080/ws/kinesis";
        return process.env.NEXT_PUBLIC_BACKEND_WS_URL || fallback;
    }, []);

    const pushLog = useCallback((line: string) => {
        const msg = `${new Date().toLocaleTimeString()} [INFO] ${line}`;
        setLogs((prev) => [...prev.slice(-100), msg]);
    }, []);

    const sendJson = useCallback((payload: unknown) => {
        const ws = wsRef.current;
        if (ws?.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(payload));
        }
    }, []);

    const clearTranscription = useCallback(() => {
        if (transcriptionTimerRef.current) {
            window.clearTimeout(transcriptionTimerRef.current);
            transcriptionTimerRef.current = null;
        }
    }, []);

    const showTransientTranscript = useCallback(
        (text: string) => {
            if (!text) return;
            setTranscript(text);
            clearTranscription();
            transcriptionTimerRef.current = window.setTimeout(() => {
                setTranscript("");
            }, 3000);
        },
        [clearTranscription],
    );

    const teardownMedia = useCallback(async () => {
        if (frameTimerRef.current) {
            window.clearInterval(frameTimerRef.current);
            frameTimerRef.current = null;
        }
        processorRef.current?.disconnect();
        sourceRef.current?.disconnect();
        processorRef.current = null;
        sourceRef.current = null;

        if (audioCtxRef.current) {
            try {
                await audioCtxRef.current.close();
            } catch {
                // ignore
            }
        }
        audioCtxRef.current = null;

        mediaRef.current?.getTracks().forEach((t) => t.stop());
        mediaRef.current = null;
        setCameraActive(false);
    }, []);

    const startMedia = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: { sampleRate: 16000, channelCount: 1, noiseSuppression: true, echoCancellation: true },
            video: { width: { ideal: 960 }, height: { ideal: 540 }, frameRate: { ideal: 20, max: 24 } },
        });

        mediaRef.current = stream;
        setCameraActive(true);
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play().catch(() => undefined);
        }

        const audioCtx = new AudioContext({ sampleRate: 16000 });
        const source = audioCtx.createMediaStreamSource(stream);
        const processor = audioCtx.createScriptProcessor(1024, 1, 1);
        source.connect(processor);
        processor.connect(audioCtx.destination);

        processor.onaudioprocess = (event) => {
            const pcm = floatToPcm16(event.inputBuffer.getChannelData(0));
            const level = Math.min(1, Math.max(0.08, Math.sqrt(pcm.reduce((a, b) => a + b * b, 0) / pcm.length) / 9000));
            setUserLevel(level);
            setOrbState((prev) => (prev === "thinking" || prev === "speaking" ? prev : "listening"));
            sendJson({ type: "media", mimeType: "audio/pcm", sampleRate: 16000, data: toBase64(pcm.buffer) });
        };

        audioCtxRef.current = audioCtx;
        sourceRef.current = source;
        processorRef.current = processor;

        frameTimerRef.current = window.setInterval(() => {
            const video = videoRef.current;
            if (!video || video.videoWidth === 0 || video.videoHeight === 0) return;
            const canvas = document.createElement("canvas");
            canvas.width = 512;
            canvas.height = 288;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const b64 = canvas.toDataURL("image/jpeg", 0.72).split(",")[1];
            sendJson({ type: "media", mimeType: "image/jpeg", data: b64 });
        }, FRAME_INTERVAL_MS);
    }, [sendJson]);

    const connect = useCallback(async () => {
        if (wsRef.current?.readyState === WebSocket.OPEN) return;
        manualDisconnectRef.current = false;
        setOrbState("reconnecting");
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = async () => {
            reconnectAttemptsRef.current = 0;
            pushLog("Vertex AI Live link established.");
            await startMedia();
            setOrbState("listening");
        };

        ws.onmessage = async (event) => {
            let msg: WsEvent;
            try {
                msg = JSON.parse(event.data) as WsEvent;
            } catch {
                return;
            }

            if (msg.type === "ready") {
                pushLog("System identity synchronized.");
                if (msg.startup && typeof msg.startup === "object") {
                    const startup = msg.startup as Record<string, unknown>;
                    setMetrics({
                        latency_ms: Number(startup.latency_ms ?? 0) || null,
                        billing_enabled: Boolean((startup.billing as Record<string, unknown> | undefined)?.enabled),
                        monitoring_series: Number((startup.monitoring as Record<string, unknown> | undefined)?.series_seen ?? 0),
                        capabilities_ok: Boolean(startup.ok),
                    });
                }
            } else if (msg.type === "agent_text") {
                setOrbState("thinking");
                showTransientTranscript(msg.text);
                pushLog(`Kinesis: ${msg.text}`);
                window.setTimeout(() => setOrbState("listening"), 320);
            } else if (msg.type === "agent_audio") {
                const audio = audioRef.current;
                if (!audio) return;
                const url = URL.createObjectURL(base64ToBlob(msg.data, msg.mimeType));
                audio.src = url;
                setOrbState("speaking");
                setAiLevel(0.72);
                await audio.play().catch(() => undefined);
                window.setTimeout(() => setAiLevel(0.14), 420);
            } else if (msg.type === "audio_frequency") {
                setUserLevel(Math.max(0.08, Math.min(1, msg.value)));
            } else if (msg.type === "brain_log") {
                setShowDiag(true);
                pushLog(`[${msg.level.toUpperCase()}] ${msg.message}`);
            } else if (msg.type === "system_metrics") {
                setMetrics((prev) => ({ ...prev, ...(msg.metrics as Metrics) }));
                setShowDiag(true);
            } else if (msg.type === "barge_in_ack") {
                setRippling(true);
                window.setTimeout(() => setRippling(false), 280);
            } else if (msg.type === "error") {
                setOrbState("error");
                pushLog(`[ERROR] ${msg.message}`);
            }
        };

        ws.onerror = () => {
            setOrbState("error");
            pushLog("Transport error detected.");
        };

        ws.onclose = async () => {
            await teardownMedia();
            if (manualDisconnectRef.current) {
                setOrbState("idle");
                return;
            }
            const attempt = reconnectAttemptsRef.current + 1;
            reconnectAttemptsRef.current = attempt;
            const wait = Math.min(6000, RECONNECT_MIN_MS * attempt);
            setOrbState("reconnecting");
            pushLog(`Realtime link dropped. Retry in ${wait}ms.`);
            window.setTimeout(() => void connect(), wait);
        };
    }, [pushLog, showTransientTranscript, startMedia, teardownMedia, wsUrl]);

    const disconnect = useCallback(async () => {
        manualDisconnectRef.current = true;
        wsRef.current?.close();
        wsRef.current = null;
        await teardownMedia();
        clearTranscription();
        setTranscript("");
        setOrbState("idle");
    }, [clearTranscription, teardownMedia]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const onEnded = () => {
            setAiLevel(0.1);
            setOrbState((prev) => (prev === "speaking" ? "listening" : prev));
        };
        audio.addEventListener("ended", onEnded);
        return () => audio.removeEventListener("ended", onEnded);
    }, []);

    useEffect(() => {
        const timer = window.setTimeout(() => setShowDiag(false), 9000);
        return () => window.clearTimeout(timer);
    }, [metrics, logs.length]);

    useEffect(() => {
        return () => {
            void disconnect();
        };
    }, [disconnect]);

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#050505] text-slate-100">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(30,41,59,0.35),transparent_58%)]" />

            <AnimatePresence>
                {orbState === "reconnecting" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-40 grid place-items-center bg-black/40 backdrop-blur-sm"
                    >
                        <div className="reconnect-grid rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center backdrop-blur-xl sm:px-6 sm:py-4">
                            <p className="text-sm tracking-wide text-slate-200 sm:text-lg">Kinesis // Realigning Neural Pathways...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <OpticalFeed active={cameraActive} videoRef={videoRef} />
            <SystemDiagnostics visible={showDiag} metrics={metrics} />
            <ProtocolLogs logs={logs} />
            <LiveTranscription text={transcript} />

            <section className="relative z-10 flex min-h-screen items-center justify-center px-4">
                <div className="text-center">
                    <p className="mb-2 text-[9px] uppercase tracking-[0.22em] text-cyan-200/80 sm:mb-3 sm:text-[11px] sm:tracking-[0.28em]">Kinesis Void</p>
                    <KinesisOrb state={orbState} userLevel={userLevel} aiLevel={aiLevel} rippling={rippling} />
                    <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-slate-300/80 sm:mt-4 sm:text-xs sm:tracking-[0.25em]">{orbState}</p>
                </div>
            </section>

            <audio ref={audioRef} className="hidden" />

            <div
                role="button"
                tabIndex={0}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                onClick={() => {
                    if (orbState === "idle") {
                        void connect();
                    } else {
                        sendJson({ type: "barge_in" });
                        setRippling(true);
                        window.setTimeout(() => setRippling(false), 280);
                    }
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (orbState === "idle") {
                            void connect();
                        } else {
                            sendJson({ type: "barge_in" });
                        }
                    }
                    if (e.key.toLowerCase() === "x") {
                        void disconnect();
                    }
                }}
                className="absolute inset-0 z-30 cursor-none"
                aria-label="Toggle voice presence"
            />

            <AnimatePresence>
                {hovering && (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        className="pointer-events-none absolute bottom-3 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-slate-200 backdrop-blur sm:bottom-6 sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.2em]"
                    >
                        {orbState === "idle" ? "Tap to Initialize Mic/Camera" : "Tap to Barge-In · Press X to Halt"}
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
