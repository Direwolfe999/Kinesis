from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict

class ProfileUpdate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    bio: Optional[str] = None

class SecurityUpdate(BaseModel):
    current_password: str
    new_password: str

class APIKeyCreate(BaseModel):
    name: str

class APIKeyResponse(BaseModel):
    id: str
    name: str
    token_prefix: str
    created_at: str
    token_full: Optional[str] = None # Only populated on creation

class PreferenceUpdate(BaseModel):
    theme: str
    ui_density: str
    default_ai_model: str
    log_retention: str
    notifications: Dict[str, bool]

class IntegrationUpdate(BaseModel):
    provider: str
    token: str

class IntegrationResponse(BaseModel):
    provider: str
    status: str
