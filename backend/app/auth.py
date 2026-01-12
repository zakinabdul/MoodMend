import firebase_admin
from firebase_admin import auth, credentials
from fastapi import HTTPException, Security, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from .models import User
from .db import get_session
from sqlmodel import Session, select

# Initialize Firebase Admin
# In production, we usually provide credentials via JSON file or environment variables.
# For simplicity with Google Auth on frontend, we can initialize with default creds if running on GCP,
# OR we just rely on token verification without service account if we don't need admin privileges (just decoding).
# However, verify_id_token() downloads public keys, so it doesn't strictly need a service account key for verification alone.
if not firebase_admin._apps:
    firebase_admin.initialize_app()

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid authentication credentials: {e}")

def get_current_user(request: Request, token_data: dict = Security(verify_token), session: Session = next(get_session())):
    """
    Dependency to get the current user from the Database.
    If user doesn't exist, create them (lazy registration).
    """
    uid = token_data.get("uid")
    email = token_data.get("email")
    
    if not uid:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    # Check if user exists
    statement = select(User).where(User.firebase_uid == uid)
    user = session.exec(statement).first()
    
    if not user:
        # Create new user
        user = User(firebase_uid=uid, email=email or "")
        session.add(user)
        session.commit()
        session.refresh(user)
        
    return user
