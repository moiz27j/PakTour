from datetime import datetime, timedelta
import uuid

class SessionManager:
    def __init__(self):
        self.sessions = {}
        self.cleanup_interval = timedelta(hours=1)  # Clean sessions older than 1 hour

    def create_session(self):
        """Create a new session with unique ID"""
        session_id = str(uuid.uuid4())
        self.sessions[session_id] = {
            "created_at": datetime.now(),
            "states": {
                "destination": None,
                "origin": None,
                "days": None,
                "mood": None,
                "route": None,
            },
            "current_step": "destination",
            "system_message": []
        }
        return session_id

    def get_session(self, session_id):
        """Get session data if exists and not expired"""
        self.cleanup_old_sessions()
        return self.sessions.get(session_id)

    def cleanup_old_sessions(self):
        """Remove expired sessions"""
        current_time = datetime.now()
        expired_sessions = [
            sid for sid, data in self.sessions.items()
            if current_time - data["created_at"] > self.cleanup_interval
        ]
        for sid in expired_sessions:
            del self.sessions[sid]