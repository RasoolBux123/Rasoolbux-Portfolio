import { API_URL } from "./config";
import type { ContactForm, ContactResult } from "./types";

export async function sendContact(form: ContactForm): Promise<ContactResult> {
  try {
    const res = await fetch(`${API_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) return { ok: true };
    const data = await res.json().catch(() => ({}));
    return { ok: false, error: data.error ?? "Something went wrong", fields: data.fields };
  } catch {
    return { ok: false, error: "Could not reach the server. Please try again." };
  }
}