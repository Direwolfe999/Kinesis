import psutil

async def get_system_metrics(activity=False):
    if activity:
        return [
            {"id": 1, "timestamp": "10:42:01", "system": "CI/CD", "message": "Pipeline backend-v2 completed.", "status": "info"},
            {"id": 2, "timestamp": "10:41:15", "system": "k8s", "message": "Pod autoscaler scaled up auth-svc to 3 replicas.", "status": "success"},
            {"id": 3, "timestamp": "10:38:22", "system": "Sec", "message": "Daily vulnerability scan finished. 0 critical.", "status": "warning"},
            {"id": 4, "timestamp": "10:30:00", "system": "AI", "message": "Generated weekly infrastructure report.", "status": "info"}
        ]
        
    cpu_percent = psutil.cpu_percent()
    ram_percent = psutil.virtual_memory().percent
    
    # Calculate a mocked "health score" based on CPU / RAM load inversions
    health = max(0, 100 - (cpu_percent * 0.2 + ram_percent * 0.2))

    return {
        "health_score": f"{health:.1f}%",
        "incidents": 0,
        "services": 48,
        "carbon": "1.2kg CO2",
        "cpu_usage": cpu_percent,
        "ram_usage": ram_percent
    }
