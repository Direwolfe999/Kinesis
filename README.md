# Project: Kinesis — Autonomous Multimodal Lifeform

> World's first real-time multimodal AI agent with autonomous cloud agency, built on Gemini 3 Flash.

## Architecture

```
Browser (Mic + Camera)
  ↕ WebSocket /ws/kinesis
FastAPI Backend (ADK Runner + LiveRequestQueue)
  ↕ Vertex AI Live (gemini-3-flash-live)
  ↕ Google Cloud APIs (self-upgrade, storage, billing, monitoring)
```

### Core files

| Layer | File | Purpose |
|-------|------|---------|
| Backend | `backend/main.py` | FastAPI command center, ADK runner, ws handler |
| Backend | `backend/tools.py` | Cloud agency tools (self-upgrade, health, billing, memory, secrets) |
| Frontend | `frontend/app/page.tsx` | Immersive dashboard, ws client, media pipeline |
| Frontend | `frontend/components/KinesisOrb.tsx` | Siri-evolved orb with idle/listening/thinking/speaking states |
| Frontend | `frontend/components/OpticalFeed.tsx` | Camera feed with neural scanline |
| Frontend | `frontend/components/SystemDiagnostics.tsx` | Floating bento metrics |
| Frontend | `frontend/components/ProtocolLogs.tsx` | Streaming protocol logs |
| Frontend | `frontend/components/LiveTranscription.tsx` | Ghost-text speech overlay |

## Quick start

### 1. Backend

```bash
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
export GOOGLE_CLOUD_PROJECT=kinesis-489618
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8080
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000 — tap anywhere to initialize.

## Cloud deploy

- **Dockerfile** at repo root builds combined container
- **docker-compose.yml** for local multi-service
- **deployment/** has Cloud Build and Cloud Run manifests

## ADK tool suite

| Tool | Purpose |
|------|---------|
| `self_upgrade_protocol(api_name)` | Enable disabled GCP APIs at runtime |
| `neural_memory_snapshot(data, mime_type)` | Save session snapshots to GCS |
| `system_health_check()` | Probe billing, monitoring, secrets, storage roles |
| `billing_spend_report(hours)` | Query BigQuery billing export for real spend |
| `fetch_secret(secret_name)` | Read secrets from Secret Manager |

## Key features

- **Vision integration**: JPEG frames streamed at ~2fps for multimodal perception
- **Raw PCM audio**: 16kHz mono voice streaming with barge-in support
- **Reactive orb**: Frequency-driven scale/blur/hue shifts synced to voice
- **No visible buttons**: Tap-to-initialize, tap-to-barge-in, X to halt
- **Self-diagnostic startup**: Agent announces capabilities on first connect
- **Reconnect resilience**: Exponential backoff auto-reconnect on drop
