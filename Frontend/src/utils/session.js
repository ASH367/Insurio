// session.js
  
  export function createNewSessionId() {
    const newSessionId =
      Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    localStorage.setItem("session-id", newSessionId);
    localStorage.setItem("session-expiry", expiresAt.toString());
    return newSessionId;
  }

  function isSessionExpired() {
    const expiry = parseInt(localStorage.getItem("session-expiry"), 10);
    return !expiry || Date.now() > expiry;
  }
  
  export function getSessionId() {
    return localStorage.getItem("session-id");
  }
  
  export function getOrCreateSessionId(forceNew = false) {
    if (forceNew || isSessionExpired()) {
    return createNewSessionId();
  }
  
    let sessionId = getSessionId();
    if (!sessionId) {
      sessionId = createNewSessionId();
    }
    return sessionId;
  }
  
  export function resetSessionId() {
    localStorage.removeItem("session-id");
    localStorage.removeItem("session-expiry");
  }
  