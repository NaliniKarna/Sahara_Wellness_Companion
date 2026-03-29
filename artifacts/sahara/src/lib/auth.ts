/**
 * Simple session ID management for the Sahara app.
 * Generates a random session ID on first load and stores it in localStorage.
 * Used for the X-Session-Id header in API requests.
 */
export function getSessionId(): string {
  if (typeof window === "undefined") return "server-side";
  
  let id = localStorage.getItem("sahara_session_id");
  if (!id) {
    id = "sess_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("sahara_session_id", id);
  }
  return id;
}

export function getAuthHeaders() {
  return {
    "X-Session-Id": getSessionId(),
    "Content-Type": "application/json",
  };
}

export function getAuthOptions() {
  return {
    request: {
      headers: getAuthHeaders(),
    },
  };
}
