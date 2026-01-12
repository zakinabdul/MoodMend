import firebase_admin
from firebase_admin import auth, credentials
from fastapi import HTTPException, Security, Request, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
import json
from .models import User
from .db import get_session
from sqlmodel import Session, select

# Initialize Firebase Admin
if not firebase_admin._apps:
    service_account_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
    if service_account_json:
        # Parse the JSON string from environment variable
        try:
            cred_dict = json.loads(service_account_json)
            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
            print("Firebase initialized with Service Account.")
        except json.JSONDecodeError as e:
            print(f"Error parsing FIREBASE_SERVICE_ACCOUNT_JSON: {e}")
            firebase_admin.initialize_app()
    else:
        # Fallback to default credentials (works on GCP, or for public key fetch only)
        print("Firebase initialized with Default Credentials.")
        firebase_admin.initialize_app()

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid authentication credentials: {e}")

def get_current_user(request: Request, token_data: dict = Security(verify_token), session = Depends(get_session)):
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
