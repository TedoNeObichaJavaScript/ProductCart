"use server";

import { contactSchema } from "@/lib/validations/contact";

import type { ActionResult } from "./types";

export async function submitContact(raw: unknown): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    // In production this would persist the message and/or send an email
    // (e.g. via Resend). For now we log it server-side.
    console.info("New contact message", {
      name: parsed.data.name,
      email: parsed.data.email,
    });
    return { ok: true };
  } catch (error) {
    console.error("submitContact failed", error);
    return { ok: false, error: "Could not send your message" };
  }
}
