import asyncio
import json
import logging
from typing import Dict, List, Any
from fastapi import WebSocket, WebSocketDisconnect

logger = logging.getLogger("synaegis.websocket")

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {
            "dashboard": [],
            "pipeline": [],
            "cloud": [],
            "security": [],
            "synaegis": []
        }

    async def connect(self, websocket: WebSocket, channel: str):
        await websocket.accept()
        if channel not in self.active_connections:
            self.active_connections[channel] = []
        self.active_connections[channel].append(websocket)
        logger.info(f"Client connected to {channel}. Total: {len(self.active_connections[channel])}")

    def disconnect(self, websocket: WebSocket, channel: str):
        if channel in self.active_connections and websocket in self.active_connections[channel]:
            self.active_connections[channel].remove(websocket)
            logger.info(f"Client disconnected from {channel}.")

    async def broadcast(self, message: dict, channel: str):
        if channel not in self.active_connections:
            return
        
        dead_connections = []
        for connection in self.active_connections[channel]:
            try:
                await connection.send_json(message)
            except Exception as e:
                dead_connections.append(connection)
        
        for dead in dead_connections:
            self.disconnect(dead, channel)

manager = ConnectionManager()
