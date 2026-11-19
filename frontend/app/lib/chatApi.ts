import { API_URL } from "./config";
import type { ChatReply } from "./types";

// Sends the visitor's message to the Node.js API and returns the bot's reply.
export async function sendMessage(message: string): Promise<ChatReply> {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Could not reach the assistant");
  }
  return res.json();
}