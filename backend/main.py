from datetime import datetime, timezone
import os
from pathlib import Path
from typing import List

import firebase_admin
from dotenv import load_dotenv
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from firebase_admin import auth, credentials, firestore
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / '.env')

firebase_cred_path = Path(os.getenv('FIREBASE_CREDENTIALS_PATH', 'serviceAccountKey.json'))
if not firebase_cred_path.is_absolute():
    firebase_cred_path = BASE_DIR / firebase_cred_path

db = None
if firebase_cred_path.exists():
    try:
        if not firebase_admin._apps:
            firebase_admin.initialize_app(credentials.Certificate(str(firebase_cred_path)))
        db = firestore.client()
    except Exception as exc:
        print(f'Warning: Firebase initialization failed: {exc}')
else:
    print(f'Warning: Firebase credentials not found at {firebase_cred_path}.')

app = FastAPI(title='Event Planner API - Firebase')
origins = [x.strip() for x in os.getenv('CORS_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173').split(',') if x.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=['*'], allow_headers=['*'])

class EventCreate(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    description: str = Field(min_length=1, max_length=2000)
    date: str
    time: str
    venue: str = Field(min_length=1, max_length=200)
    capacity: int = Field(gt=0, le=100000)
    organizer_id: str

class RSVPCondition(BaseModel):
    user_id: str
    status: str

VALID_RSVP = {'Going', 'Maybe', 'Not Going'}

def require_db():
    if db is None:
        raise HTTPException(status_code=503, detail='Firebase is not configured. Add backend/serviceAccountKey.json.')
    return db

async def verify_token(authorization: str | None = Header(default=None)):
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail='Invalid authorization header')
    try:
        return auth.verify_id_token(authorization.split(' ', 1)[1])
    except Exception:
        raise HTTPException(status_code=401, detail='Invalid or expired token')

@app.get('/')
def read_root():
    return {'message': 'Welcome to Event Planner API with Firebase'}

@app.post('/events/')
def create_event(event: EventCreate):
    database = require_db()
    event_data = event.model_dump()
    event_data['created_at'] = datetime.now(timezone.utc).isoformat()
    doc_ref = database.collection('events').document()
    doc_ref.set(event_data)
    return {'message': 'Event created', 'data': {'id': doc_ref.id, **event_data}}

@app.get('/events/')
def get_events():
    database = require_db()
    events = []
    for doc in database.collection('events').stream():
        data = doc.to_dict()
        data['id'] = doc.id
        events.append(data)
    return events

@app.get('/events/{event_id}')
def get_event(event_id: str):
    database = require_db()
    snapshot = database.collection('events').document(event_id).get()
    if not snapshot.exists:
        raise HTTPException(status_code=404, detail='Event not found')
    return {'id': snapshot.id, **snapshot.to_dict()}

@app.post('/events/{event_id}/rsvp')
def rsvp_to_event(event_id: str, rsvp: RSVPCondition):
    database = require_db()
    if rsvp.status not in VALID_RSVP:
        raise HTTPException(status_code=422, detail=f'Status must be one of: {", ".join(sorted(VALID_RSVP))}')
    if not database.collection('events').document(event_id).get().exists:
        raise HTTPException(status_code=404, detail='Event not found')
    rsvp_id = f'{event_id}_{rsvp.user_id}'
    rsvp_data = rsvp.model_dump()
    rsvp_data.update(event_id=event_id, updated_at=datetime.now(timezone.utc).isoformat())
    database.collection('rsvps').document(rsvp_id).set(rsvp_data)
    return {'message': 'RSVP updated successfully', 'data': rsvp_data}

@app.get('/events/{event_id}/rsvps')
def get_event_rsvps(event_id: str):
    database = require_db()
    return [doc.to_dict() for doc in database.collection('rsvps').where('event_id', '==', event_id).stream()]
