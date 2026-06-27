"use client";

import { Loader2, ShieldCheck, ShieldOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  disableTwoFactor,
  enableTwoFactor,
  startTwoFactorSetup,
} from "@/server/actions/two-factor";

type Setup = { qr: string; secret: string };

export function TwoFactorCard({ enabled }: { enabled: boolean }) {
  const t = useTranslations("TwoFactor");
  const router = useRouter();
  const [setup, setSetup] = useState<Setup | null>(null);
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);

  async function onStart() {
    setPending(true);
    const result = await startTwoFactorSetup();
    setPending(false);
    if (result.ok && result.data) setSetup(result.data);
    else toast.error(t("errorToast"));
  }

  async function onConfirm() {
    setPending(true);
    const result = await enableTwoFactor(code);
    setPending(false);
    if (result.ok) {
      toast.success(t("enabledToast"));
      setSetup(null);
      setCode("");
      router.refresh();
    } else {
      toast.error(result.fieldErrors?.token?.[0] ?? t("errorToast"));
    }
  }

  async function onDisable() {
    setPending(true);
    const result = await disableTwoFactor();
    setPending(false);
    if (result.ok) {
      toast.success(t("disabledToast"));
      router.refresh();
    } else {
      toast.error(t("errorToast"));
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              {enabled ? (
                <ShieldCheck className="size-5 text-primary" />
              ) : (
                <ShieldOff className="size-5 text-muted-foreground" />
              )}
              {t("title")}
            </CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>
          <Badge variant={enabled ? "default" : "secondary"}>
            {enabled ? t("statusOn") : t("statusOff")}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {enabled ? (
          <Button variant="destructive" onClick={onDisable} disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            {t("disable")}
          </Button>
        ) : setup ? (
          <div className="space-y-4">
            <div>
              <p className="font-medium">{t("setupTitle")}</p>
              <p className="text-sm text-muted-foreground">{t("setupHint")}</p>
            </div>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={setup.qr}
                alt="2FA QR code"
                width={180}
                height={180}
                className="rounded-lg border bg-card p-2"
              />
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="text-muted-foreground">{t("manualKey")}</p>
                  <code className="rounded bg-muted px-2 py-1 text-xs break-all">
                    {setup.secret}
                  </code>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium" htmlFor="totp-code">
                    {t("codeLabel")}
                  </label>
                  <Input
                    id="totp-code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder={t("codePlaceholder")}
                    value={code}
                    onChange={(e) =>
                      setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    className="w-40 text-center tracking-[0.4em]"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setSetup(null);
                  setCode("");
                }}
                disabled={pending}
              >
                {t("cancel")}
              </Button>
              <Button onClick={onConfirm} disabled={pending || code.length < 6}>
                {pending && <Loader2 className="size-4 animate-spin" />}
                {t("confirm")}
              </Button>
            </div>
          </div>
        ) : (
          <Button onClick={onStart} disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            {t("enable")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
