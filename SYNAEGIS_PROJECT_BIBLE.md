# SynAegis: The Complete Project Bible (Architecture & Analysis)

## 1. System Architecture

SynAegis is built on a highly modular, decoupled architecture consisting of a modern React/Next.js frontend and a resilient FastAPI backend.

- **Frontend Layer:** Built with Next.js 15, React, Tailwind CSS, Recharts, and Framer Motion. It acts as the command center for data visualization and AI multimodal interaction.
- **Backend Layer:** Powered by FastAPI (Python), serving concurrent REST APIs for application state and WebSockets for real-time telemetry and bi-directional continuous audio streaming.
- **AI/Agent Layer:** Uses the Google Gemini Live Agent API (through `google-genai` and `main_production.py`) as the primary brain. It supports real-time voice, vision (camera), text barge-in, and auto-action tool execution.
- **Integration Layer:** Provides modular scripts (`gitlab_tools.py`, `green_tools.py`, `system_metrics.py`) to fetch data from GitLab, cloud services, and custom internal state engines.

### Data Flow Overview
1. **User Interaction:** The user interacts with the UI or speaks into the microphone via `LiveAgent.tsx`.
2. **WebSocket Relay:** Audio buffers and system telemetry are streamed to the FastAPI backend over secure WebSockets.
3. **AI Processing:** The backend routes audio to the Gemini Live API. Gemini evaluates context, decides if a tool execution is needed, and streams an audio response back.
4. **State Mutations:** If an auto-action (e.g., "deploy pipeline", "rollback server") is invoked, the backend executes the corresponding python tool (`gitlab_tools.py`, etc.) and broadcasts the new state back to the frontend dashboard.
5. **UI Re-render:** The frontend receives the incoming state/audio stream, triggers Framer Motion animations, dynamically updates Recharts data, and renders global native `ToastProvider` Modals.

---

## 2. Feature Inventory

### Live, Real-Time, & Production-Ready
- **Multimodal AI Voice Agent:** Real-time conversational AI with barge-in interruption logic. (Uses: Gemini Live API + WebSockets).
- **Dynamic Telemetry Dashboard (Global Command):** Live charts rendering CPU, memory, API latency, and Carbon Usage. (Uses: FastAPI WebSockets + Recharts).
- **Custom Modals & Toasts:** Globalized alert and validation system. (Uses: React Context + Framer Motion).
- **User Settings Persistence:** Real-time Avatar uploading, base64 encoding to LocalStorage, and component state propagation for cross-app updates.
- **Interactive UI Shell:** Seamless navigation between CICD, Cloud, Security, and Settings panels without hard reloads.

### Simulated / Backend-Backed Features
- **CI/CD Pipeline Visualization:** Displays recent builds, commits, and pipeline states. Buttons are wired to global modals.
- **Security Dashboard:** Visualizes active security policies, SQL injection attempts, and system logs.
- **Cloud Infrastructure Center:** Shows active instances, server statuses, and region mappings.
- **API Key & Integration Management:** Fully stateful frontend implementation demonstrating key generation, revocation, and platform toggling (GitLab, Slack, etc.).

---

## 3. Frontend Mapping

### Framework: Next.js 15 (App Router)
#### Core Components (`frontend/components/`)
1. **`GlobalCommandDashboard.tsx`:** The root orchestrator. Holds the primary real-time charts (Area/Bar) for Server Load, Memory, and Latency. Listens to the core telemetry WebSocket.
2. **`CICDDashboard.tsx`:** Pipeline overview. Contains metrics for deploys, failure rates, and active builds. Wired to global notification Modals.
3. **`CloudDashboard.tsx`:** Infrastructure map. Visualizes container instances and active servers. Includes "Test Connection" and "Reboot" mocked event handlers.
4. **`SecurityDashboard.tsx`:** Threat detection UI. Renders simulated SOC (Security Operations Center) data.
5. **`SettingsDashboard.tsx`:** Highly interactive profile configuration. Handles Avatar processing (`FileReader`), theme management, API Key generation arrays, and Integration toggles.
6. **`Sidebar.tsx` / `ToastProvider.tsx`:** Global layout wrappers. The Sidebar listens to `av_change` events to update avatars dynamically. The ToastProvider handles stacking notifications and frosted-glass Action Modals.
7. **`LiveAgent.tsx` / `SynAegisOrb.tsx`:** Visual and functional hubs for the Gemini Live integration. The Orb animates based on "listening," "thinking," and "speaking" states.

---

## 4. Backend Mapping

### Framework: FastAPI (Python 3)
#### Core Modules (`backend/`)
1. **`main.py` / `main_production.py`:** The FastAPI application entry points. Bootstraps CORS, WebSocket routes, and standard REST API endpoints. Integrates seamlessly with the Gemini ADK.
2. **`agent_logic.py` / `tools.py`:** Contains the registry of functions the AI agent can execute. Maps natural language requests to code logic.
3. **`system_metrics.py`:** Polling engine that generates live CPU, RAM, and simulated Carbon data for the frontend Recharts arrays.
4. **`gitlab_tools.py`:** Integration module targeting GitLab APIs. Fetches merge requests, triggers pipelines, and returns pipeline metadata.
5. **`green_tools.py`:** Evaluates carbon footprint data and recommends eco-friendly server scaling.

#### Endpoints
- **`WS /ws/telemetry`:** Pushes real-time JSON arrays (must be native JS Numbers) to the frontend Recharts.
- **`WS /ws/agent`:** Bi-directional audio buffer stream connecting the browser's Mic/Speaker to FastAPI to Gemini.
- **`GET /api/profile` & `POST /api/profile`:** REST endpoints handling user configurations.

---

## 5. Integration Mapping

1. **Google Gemini Live API:**
   - **Role:** Main cognitive engine.
   - **Flow:** Browser Audio -> FastAPI Websocket -> Gemini ADK -> FastAPI Websocket -> Browser Speaker.
2. **GitLab API:**
   - **Role:** CI/CD Truth Source.
   - **Flow:** Gemini Agent detects user intent to "Check deployment" -> Agent calls `gitlab_tools.fetch_pipelines()` -> Backend securely hits GitLab REST API -> Data fed back to Agent to synthesize voice response.
3. **Mocked Third Parties (Slack, Jira, AWS):**
   - **Role:** UI Demonstrations for Hackathon presentation.
   - **Flow:** Managed purely in `SettingsDashboard.tsx` state array. Ready to be wired into real OAuth flows post-hackathon.

---

## 6. Data Flow & Real-Time Behavior

**Real-Time Dashboard Telemetry:**
`Backend Polling Loop` -> Updates local dict -> `FastAPI /ws/telemetry` -> `GlobalCommandDashboard.tsx` -> JSON parsing `Number(metric)` -> `Recharts <AreaChart>` updates visually (every 1-3 seconds).

**Actionable Execution (Auto-Actions):**
`User Voice Command ("Deploy the server")` -> `Gemini ADK` evaluates tool registry -> Calls python function `deploy_server()` -> Function fires `Backend REST Endpoint` -> Backend emits success via HTTP Return -> `Frontend` catches HTTP response and fires `showModal({ title: "Deploy Started" })`.

---

## 7. Analysis & Recommendations

### Weak Points / Missing Connections
- **Data Persistence:** Currently, settings like API Keys and Integrations are stored in React component State or LocalStorage. Upon hard refresh or cross-device login, they revert. 
- **WebSocket Reconnection:** If the FastAPI server restarts, the frontend WebSocket connections may crash or remain stale without aggressive exponential backoff reconnect logic.

### Recommendations for Hackathon Scoring
- **Highlight the Multimodal Interruption (Barge-In):** The Gemini Live Agent's ability to be interrupted while speaking is its most powerful feature. Emphasize this heavily in your demo video.
- **Showcase the Tool Calling:** Ensure the Agent physically clicks a button or updates a chart based on voice command. This proves the integration loop is full-circle.
- **GreenOps Angle:** Cloud infrastructure carbon tracking is a massive trend. Point out the `green_tools.py` logic to win extra points for sustainability innovation.

---

## 8. Project Summary Diagram

```text
 ┌────────────────────────────────────────────────────────┐
 │                      FRONTEND (Next.js)                │
 │                                                        │
 │ ┌────────────┐   ┌────────────┐   ┌────────────┐       │
 │ │  Sidebar   │   │  Settings  │   │   Modals   │       │
 │ └────────────┘   └──────┬─────┘   └──────┬─────┘       │
 │                         │                │             │
 │ ┌────────────┐   ┌──────▼─────┐   ┌──────▼─────┐       │
 │ │ CICD / Web │   │ Global Dash│   │ Live Agent │       │
 │ └─────┬──────┘   └──────┬─────┘   └──────┬─────┘       │
 └───────│─────────────────│────────────────│─────────────┘
         │ (REST)          │ (WS Telemetry) │ (WS Audio)
 ┌───────▼─────────────────▼────────────────▼─────────────┐
 │                      BACKEND (FastAPI)                 │
 │                                                        │
 │ ┌────────────┐   ┌────────────┐   ┌────────────┐       │
 │ │ Router API │   │ Metrics Gen│   │ Agent Relay│ <─────┐
 │ └────────────┘   └──────┬─────┘   └──────┬─────┘       │
 │                         │                │             │
 │ ┌────────────┐   ┌──────▼─────┐   ┌──────▼─────┐       │
 │ │ DB / Config│   │ Green Tools│   │GitLab Tools│       │
 │ └────────────┘   └────────────┘   └────────────┘       │
 └────────────────────────────────────────────────────────┘
                                            │ (gRPC / HTTP)
                                     ┌──────▼─────┐
                                     │ Gemini API │
                                     └────────────┘
```

---

## 9. Actionable Next Steps

### Step-by-Step for the specific final stretch:
1. **Polish the UI:**
   - All interactive mockups (Modals, Toasts) have been completed. Ensure you walk through all tabs (CICD, Cloud, Security, Settings) in your video recording to show completeness.
2. **Backend Stabilization:**
   - Double check your environment variables (`.env`) for your Google Gemini API Key and GitLab API keys. If they are missing, the websocket audio relay will crash.
3. **Demo Execution:**
   - Ensure you are running both frontend and backend concurrently.
   - Open up the `START_HERE.txt` guide. You are at the absolute final stage. Run your recording software, walk through the UI, speak to the Orb to trigger an action, and upload that video.
4. **Post-Hackathon Roadmap (Production Readiness):**
   - Connect the SQLite/PostgreSQL Database to replace LocalStorage.
   - Swap the mocked Integrations in `SettingsDashboard.tsx` for real OAuth2 providers.
   - Containerize using your `docker-compose.yml` to deploy seamlessly to Google Cloud Run natively.