import { getOrCreateSessionId } from "./session";

const MAX_MESSAGES = 10;

export function saveMessageToHistory(message) {
  const sessionId = getOrCreateSessionId();
  const key = `chat-history-${sessionId}`;
  let history = JSON.parse(localStorage.getItem(key)) || [];

  // Add new message
  history.push(message);

  // Keep only the last 30
  if (history.length > MAX_MESSAGES) {
    history = history.slice(history.length - MAX_MESSAGES);
  }

  localStorage.setItem(key, JSON.stringify(history));
}

export function getChatHistory() {
  const sessionId = getOrCreateSessionId();
  const key = `chat-history-${sessionId}`;
  return JSON.parse(localStorage.getItem(key)) || [];
}
