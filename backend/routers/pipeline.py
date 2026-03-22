from fastapi import APIRouter
from backend.services.gitlab_service import get_all_pipelines

router = APIRouter()

@router.get("/pipeline/list")
async def list_pipelines():
    return await get_all_pipelines()

@router.post("/pipeline/trigger")
async def trigger_pipeline(project_id: str):
    # Mock implementation of trigger
    return {"status": "success", "message": f"Pipeline triggered for project {project_id}"}

@router.post("/pipeline/cancel")
async def cancel_pipeline(pipeline_id: str):
    # Mock implementation of cancel
    return {"status": "success", "message": f"Pipeline {pipeline_id} cancelled"}

@router.get("/pipeline/logs/{pipeline_id}")
async def get_logs(pipeline_id: str):
    # Mock implementation of logs
    return {"logs": f"Logs for {pipeline_id}...\nRunning tasks...\nSuccess!"}

@router.get("/pipeline/metrics")
async def get_pipeline_metrics():
    return {"success_rate": "98%", "avg_duration_min": 4.2}
