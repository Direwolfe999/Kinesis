from fastapi import APIRouter
from backend.green_tools import calculate_pipeline_carbon, reap_zombie_environments

router = APIRouter()

@router.get("/green/carbon")
async def get_carbon_footprint(duration_seconds: int = 600):
    return calculate_pipeline_carbon(duration_seconds)

@router.post("/green/zombie/reap")
async def post_reap_zombies(idle_days: int = 7):
    return {"reaped": reap_zombie_environments(idle_days)}
