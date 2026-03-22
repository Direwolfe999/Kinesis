import json
import logging
from typing import Dict, Any
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

def get_current_time() -> str:
    """Gets the current UTC time."""
    return f"Current time is {datetime.now(timezone.utc).isoformat()}"

def get_system_status() -> Dict[str, Any]:
    """Gets system diagnostics summary."""
    return {"status": "Online", "memory_usage": "42%", "cpu_load": "15%"}

def log_interaction(event_data: str) -> str:
    """Saves user interaction safely to database (simulated DB push)."""
    logger.info(f"RAG DB Logging: {event_data}")
    return "Stored in knowledge base successfully."

def execute_action(action_type: str) -> str:
    """Executes a system action like clear_logs or reboot_stream."""
    return f"Action {action_type} executed successfully."

# Map function names to their callables
AVAILABLE_TOOLS = {
    "get_current_time": get_current_time,
    "get_system_status": get_system_status,
    "log_interaction": log_interaction,
    "execute_action": execute_action
}
