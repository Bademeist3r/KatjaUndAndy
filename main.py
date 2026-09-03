import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "*")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    raise RuntimeError("SUPABASE_URL oder SUPABASE_SERVICE_KEY fehlt in der .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Prüft den Token, den das Frontend mitschickt. Wirft 401, wenn ungültig/abgelaufen."""
    token = credentials.credentials
    try:
        user_response = supabase.auth.get_user(token)
        if not user_response.user:
            raise HTTPException(status_code=401, detail="Ungültiger Token")
        return user_response.user
    except Exception:
        raise HTTPException(status_code=401, detail="Ungültiger oder abgelaufener Token")


class AlbumEntry(BaseModel):
    image: str
    note: str = ""


@app.get("/")
def home():
    return {"message": "Backend läuft!"}


@app.get("/api/album")
def get_album(user=Depends(get_current_user)):
    """Alle Familienmitglieder sehen dieselben Einträge, inkl. Namen des Uploaders."""
    try:
        result = (
            supabase.table("album_images")
            .select("*, profiles(display_name)")
            .order("id")
            .execute()
        )
        return result.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/album")
def create_album_entry(entry: AlbumEntry, user=Depends(get_current_user)):
    try:
        result = (
            supabase.table("album_images")
            .insert({
                "image": entry.image,
                "note": entry.note,
                "user_id": user.id,
            })
            .execute()
        )
        return result.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/api/album/{entry_id}")
def delete_album_entry(entry_id: int, user=Depends(get_current_user)):
    """Jedes eingeloggte Familienmitglied darf jeden Eintrag löschen."""
    try:
        result = (
            supabase.table("album_images")
            .delete()
            .eq("id", entry_id)
            .execute()
        )
        if not result.data:
            raise HTTPException(status_code=404, detail="Eintrag nicht gefunden")
        return {"deleted": result.data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))