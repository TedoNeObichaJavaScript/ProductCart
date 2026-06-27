"use server";

import { revalidatePath } from "next/cache";
import QRCode from "qrcode";

import { db } from "@/lib/db";
import {
  isTwoFactorSatisfied,
  markSessionTwoFactorVerified,
  requireUser,
} from "@/lib/session";
import { createSecret, totpUri, verifyTotp } from "@/lib/totp";

import type { ActionResult } from "./types";

function revalidateSettings() {
  revalidatePath("/[locale]/settings", "page");
}

/** Create a fresh secret, persist it (disabled until confirmed) and return a QR code. */
export async function startTwoFactorSetup(): Promise<
  ActionResult<{ qr: string; secret: string }>
> {
  const user = await requireUser();
  try {
    const secret = createSecret();
    await db.user.update({
      where: { id: user.id },
      data: { twoFactorSecret: secret, twoFactorEnabled: false },
    });
    const uri = totpUri(secret, user.email ?? user.name ?? "account");
    const qr = await QRCode.toDataURL(uri, { margin: 1, width: 220 });
    return { ok: true, data: { qr, secret } };
  } catch (error) {
    console.error("startTwoFactorSetup failed", error);
    return { ok: false, error: "Could not start setup" };
  }
}

/** Confirm the first code and turn 2FA on. */
export async function enableTwoFactor(token: string): Promise<ActionResult> {
  const user = await requireUser();
  try {
    const record = await db.user.findUnique({
      where: { id: user.id },
      select: { twoFactorSecret: true },
    });
    if (!record?.twoFactorSecret) {
      return { ok: false, error: "Start setup first" };
    }
    if (!verifyTotp(record.twoFactorSecret, token)) {
      return {
        ok: false,
        error: "Invalid code",
        fieldErrors: { token: ["That code is incorrect"] },
      };
    }
    await db.user.update({
      where: { id: user.id },
      data: { twoFactorEnabled: true },
    });
    await markSessionTwoFactorVerified();
    revalidateSettings();
    return { ok: true };
  } catch (error) {
    console.error("enableTwoFactor failed", error);
    return { ok: false, error: "Could not enable two-factor" };
  }
}

export async function disableTwoFactor(): Promise<ActionResult> {
  const user = await requireUser();
  try {
    await db.user.update({
      where: { id: user.id },
      data: { twoFactorEnabled: false, twoFactorSecret: null },
    });
    revalidateSettings();
    return { ok: true };
  } catch (error) {
    console.error("disableTwoFactor failed", error);
    return { ok: false, error: "Could not disable two-factor" };
  }
}

/** Login challenge: verify a code and mark this session as passed. */
export async function verifyTwoFactorChallenge(
  token: string,
): Promise<ActionResult> {
  const user = await requireUser();
  try {
    if (await isTwoFactorSatisfied(user)) {
      return { ok: true };
    }
    const record = await db.user.findUnique({
      where: { id: user.id },
      select: { twoFactorSecret: true, twoFactorEnabled: true },
    });
    if (!record?.twoFactorEnabled || !record.twoFactorSecret) {
      return { ok: true };
    }
    if (!verifyTotp(record.twoFactorSecret, token)) {
      return {
        ok: false,
        error: "Invalid code",
        fieldErrors: { token: ["That code is incorrect"] },
      };
    }
    await markSessionTwoFactorVerified();
    return { ok: true };
  } catch (error) {
    console.error("verifyTwoFactorChallenge failed", error);
    return { ok: false, error: "Could not verify code" };
  }
}
