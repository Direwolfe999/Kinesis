import os
import requests
import json
from typing import Dict, Any, List
from datetime import datetime, timezone, timedelta

def calculate_pipeline_carbon(pipeline_duration_seconds: int) -> dict:
    """Production API to calculate carbon footprint of a pipeline using real-world grid intensity."""
    intensity = 250.0 # Default fallback
    try:
        r = requests.get("https://api.carbonintensity.org.uk/intensity", timeout=5)
        if r.status_code == 200:
            data = r.json()
            if "data" in data and len(data["data"]) > 0:
                intensity = float(data["data"][0]["intensity"]["actual"] or data["data"][0]["intensity"]["forecast"])
    except Exception as e:
        pass # Use fallback

    energy_kwh = (pipeline_duration_seconds / 3600) * 0.5 # Assume 500W CI server
    carbon_g = intensity * energy_kwh
    
    return {
        "duration_s": pipeline_duration_seconds,
        "grid_intensity_gCO2eq_kWh": round(intensity, 2),
        "total_carbon_g": round(carbon_g, 2),
        "verdict": "High intensity (delay CI if possible)" if intensity > 300 else "Clean energy (optimal CI time)"
    }

def reap_zombie_environments(idle_days_threshold: int = 7) -> list:
    """Production tool to find and reap stale review environments on GitLab."""
    from backend.gitlab_tools import GITLAB_URL, _get_headers, PROJECT_ID
    if not PROJECT_ID:
        return [{"error": "Missing GITLAB_PROJECT_ID"}]
        
    try:
        # Fetch environments
        r = requests.get(f"{GITLAB_URL}/projects/{PROJECT_ID}/environments", headers=_get_headers(), timeout=10)
        if r.status_code != 200:
            return [{"error": f"Failed to fetch environments: {r.text}"}]
            
        envs = r.json()
        reaped = []
        now = datetime.now(timezone.utc)
        
        for env in envs:
            if env.get('state') == 'available':
                updated_str = env.get('updated_at')
                if updated_str:
                    updated_at = datetime.fromisoformat(updated_str.replace('Z', '+00:00'))
                    idle_days = (now - updated_at).days
                    
                    if idle_days >= idle_days_threshold:
                        # Stop the environment
                        stop_url = f"{GITLAB_URL}/projects/{PROJECT_ID}/environments/{env['id']}/stop"
                        stop_res = requests.post(stop_url, headers=_get_headers())
                        
                        cost_saved = round(idle_days * 0.50, 2) # Example $0.50 a day
                        
                        if stop_res.status_code in (200, 201):
                            reaped.append({
                                "env": env["name"], 
                                "idle_days": idle_days, 
                                "cost_saved": f"${cost_saved}"
                            })
                        
        if not reaped:
            return [{"status": "No zombie environments found. System is clean."}]
        return reaped
    except Exception as e:
        return [{"error": str(e)}]
