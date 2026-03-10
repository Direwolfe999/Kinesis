# Kinesis Live Agent Architecture

```mermaid
flowchart LR
    U[User]
    FE[Next.js Frontend\nWebcam + Microphone]
    WS[Full-Duplex WebSocket]
    BE[FastAPI on Cloud Run\nSession Router + Tool Runner]
    GL[Gemini Live API\nmodel: gemini-3-flash-live\nthinking_level: low]
    FS[(Cloud Firestore\nSession Memory)]
    VTX[Vertex AI Agent Engine\nADK Agent Deployment]

    U <--> FE
    FE <--> WS
    WS <--> BE
    BE <--> GL
    BE --> FS
    VTX -. optional deploy target .-> BE
```

## Runtime flow
1. User speaks / shows camera frames in the browser.
2. Next.js streams chunked audio/video to FastAPI over WebSocket.
3. FastAPI opens a secure server-to-server Gemini Live session.
4. Gemini may return tool/function calls; backend executes tools and returns results.
5. Backend streams text/audio/video responses back to frontend in real time.
6. Firestore stores turn-level memory for session continuity and analytics.
