import os
import httpx
from dotenv import load_dotenv

load_dotenv()

GITLAB_API = "https://gitlab.com/api/v4"
GITLAB_TOKEN = os.getenv("GITLAB_TOKEN", "").strip("\"").strip("'")
GITLAB_PROJECT_ID = os.getenv("GITLAB_PROJECT_ID", "").strip("\"").strip("'")
HEADERS = {"PRIVATE-TOKEN": GITLAB_TOKEN} if GITLAB_TOKEN else {}

async def get_pipeline_stats():
    if not GITLAB_TOKEN or not GITLAB_PROJECT_ID:
        return {"running": 2, "total": 12}
    
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(
                f"{GITLAB_API}/projects/{GITLAB_PROJECT_ID}/pipelines",
                headers=HEADERS
            )
            if res.status_code == 200:
                pipelines = res.json()
                running = len([p for p in pipelines if p.get('status') == 'running'])
                return {"running": running, "total": len(pipelines)}
    except Exception:
        pass
    return {"running": 2, "total": 12}

async def get_all_pipelines():
    if not GITLAB_TOKEN or not GITLAB_PROJECT_ID:
        return [
            {"id": "pipe-101", "status": "running", "ref": "main", "web_url": "#", "created_at": "2026-03-21T10:00:00Z"},
            {"id": "pipe-100", "status": "success", "ref": "feature-auth", "web_url": "#", "created_at": "2026-03-21T09:00:00Z"},
            {"id": "pipe-99", "status": "failed", "ref": "hotfix", "web_url": "#", "created_at": "2026-03-21T08:00:00Z"},
        ]
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(
                f"{GITLAB_API}/projects/{GITLAB_PROJECT_ID}/pipelines?per_page=10",
                headers=HEADERS
            )
            if res.status_code == 200:
                return res.json()
    except Exception:
        pass
    
    return []
