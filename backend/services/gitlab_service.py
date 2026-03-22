import os
import httpx
import logging
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

GITLAB_API = "https://gitlab.com/api/v4"
GITLAB_TOKEN = os.getenv("GITLAB_TOKEN", "").strip("\"").strip("'")
GITLAB_PROJECT_ID = os.getenv("GITLAB_PROJECT_ID", "").strip("\"").strip("'")
HEADERS = {"PRIVATE-TOKEN": GITLAB_TOKEN} if GITLAB_TOKEN else {}

async def get_pipeline_stats():
    if not GITLAB_TOKEN or not GITLAB_PROJECT_ID:
        logger.warning("GITLAB_TOKEN or GITLAB_PROJECT_ID missing. Returning 0.")
        return {"running": 0, "total": 0}
    
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
            else:
                logger.error(f"GitLab API Error {res.status_code}: {res.text}")
    except Exception as e:
        logger.error(f"Failed to fetch pipeline stats: {e}")
    return {"running": 0, "total": 0}

async def get_all_pipelines():
    if not GITLAB_TOKEN or not GITLAB_PROJECT_ID:
        return []
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(
                f"{GITLAB_API}/projects/{GITLAB_PROJECT_ID}/pipelines?per_page=10",
                headers=HEADERS
            )
            if res.status_code == 200:
                return res.json()
    except Exception as e:
        logger.error(f"Failed to fetch pipelines: {e}")
    return []

async def trigger_pipeline(ref: str = "main"):
    if not GITLAB_TOKEN or not GITLAB_PROJECT_ID:
        return {"error": "Missing GitLab configuration"}
    try:
        async with httpx.AsyncClient() as client:
            res = await client.post(
                f"{GITLAB_API}/projects/{GITLAB_PROJECT_ID}/pipeline",
                headers=HEADERS,
                json={"ref": ref}
            )
            if res.status_code in (200, 201):
                return {"status": "success", "pipeline": res.json()}
            return {"error": f"Failed to trigger {res.status_code}: {res.text}"}
    except Exception as e:
        return {"error": str(e)}

async def cancel_pipeline_run(pipeline_id: str):
    if not GITLAB_TOKEN or not GITLAB_PROJECT_ID:
        return {"error": "Missing GitLab configuration"}
    try:
        async with httpx.AsyncClient() as client:
            res = await client.post(
                f"{GITLAB_API}/projects/{GITLAB_PROJECT_ID}/pipelines/{pipeline_id}/cancel",
                headers=HEADERS
            )
            if res.status_code in (200, 201):
                return {"status": "success", "message": "Pipeline cancelled successfully."}
            return {"error": f"Failed to cancel {res.status_code}: {res.text}"}
    except Exception as e:
        return {"error": str(e)}

async def get_pipeline_logs(pipeline_id: str):
    if not GITLAB_TOKEN or not GITLAB_PROJECT_ID:
        return {"logs": "Mock Logs: GitLab config missing."}
    try:
        async with httpx.AsyncClient() as client:
            # First get jobs for the pipeline
            jobs_res = await client.get(
                f"{GITLAB_API}/projects/{GITLAB_PROJECT_ID}/pipelines/{pipeline_id}/jobs",
                headers=HEADERS
            )
            if jobs_res.status_code != 200:
                return {"logs": f"Failed to fetch jobs: {jobs_res.text}"}
            jobs = jobs_res.json()
            if not jobs:
                return {"logs": "No jobs found for this pipeline."}
            job_id = jobs[0]["id"]
            # Get trace for first job
            trace_res = await client.get(
                f"{GITLAB_API}/projects/{GITLAB_PROJECT_ID}/jobs/{job_id}/trace",
                headers=HEADERS
            )
            if trace_res.status_code == 200:
                return {"logs": trace_res.text}
            return {"logs": f"Failed to fetch trace: {trace_res.text}"}
    except Exception as e:
        return {"logs": str(e)}
