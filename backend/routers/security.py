from fastapi import APIRouter
import random

router = APIRouter(prefix="/security", tags=["security"])

def generate_security_events():
    return {
        "threats": random.randint(1, 10),
        "incidents": random.randint(0, 5),
        "vulnerabilities": random.randint(2, 12),
        "risk_score": random.randint(60, 95)
    }

@router.get("/overview")
async def security_overview():
    threats = generate_security_events()
    return threats

@router.get("/history")
async def security_history():
    history = []
    for i in range(10):
        history.append({
            "time": f"10:{i}0",
            "threats": random.randint(1, 10)
        })
    return history
