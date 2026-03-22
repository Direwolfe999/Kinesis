class LlmAgent:
    def __init__(self, **kwargs): pass
class InMemorySessionService:
    def __init__(self, **kwargs): pass
    async def create_session(self, **kwargs): pass
class Runner:
    def __init__(self, **kwargs): pass
    async def run_live(self, **kwargs):
        yield type('Event', (), {})()
class RunConfig:
    def __init__(self, **kwargs): pass
class LiveRequestQueue:
    def close(self): pass
