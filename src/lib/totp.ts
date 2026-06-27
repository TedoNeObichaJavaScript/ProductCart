import * as OTPAuth from "otpauth";

const ISSUER = "ProductCart";

/** Generate a new base32 TOTP secret. */
export function createSecret(): string {
  return new OTPAuth.Secret({ size: 20 }).base32;
}

function buildTotp(secret: string, label: string): OTPAuth.TOTP {
  return new OTPAuth.TOTP({
    issuer: ISSUER,
    label,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  });
}

/** otpauth:// URI for QR codes / authenticator apps. */
export function totpUri(secret: string, label: string): string {
  return buildTotp(secret, label).toString();
}

/** Validate a 6-digit token against the secret (±1 time step for clock drift). */
export function verifyTotp(secret: string, token: string): boolean {
  const normalized = token.replace(/\s/g, "");
  if (!/^\d{6}$/.test(normalized)) return false;
  const delta = buildTotp(secret, "").validate({
    token: normalized,
    window: 1,
  });
  return delta !== null;
}
