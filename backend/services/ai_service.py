async def get_ai_activity():
    return {
        "requests_per_min": 142,
        "tokens_generated": 10450
    }

async def generate_cross_system_insights():
    return [
        {
            "id": "insight_1",
            "type": "cost",
            "title": "Cost Optimization",
            "desc": "SynAegis recommends downsizing 3 idle EC2 instances in us-east-1. Estimated saving: $140/mo.",
            "impact": "high"
        },
        {
            "id": "insight_2", 
            "type": "performance",
            "title": "Predictive Scaling",
            "desc": "Anticipating 40% traffic surge in 2 hours based on historical patterns. Pre-warming target groups.",
            "impact": "medium"
        }
    ]
