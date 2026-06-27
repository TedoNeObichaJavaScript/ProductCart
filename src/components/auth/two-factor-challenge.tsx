"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { verifyTwoFactorChallenge } from "@/server/actions/two-factor";

export function TwoFactorChallenge() {
  const t = useTranslations("TwoFactor");
  const router = useRouter();
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    const result = await verifyTwoFactorChallenge(code);
    setPending(false);
    if (result.ok) {
      router.replace("/dashboard");
      router.refresh();
    } else {
      toast.error(result.fieldErrors?.token?.[0] ?? t("errorToast"));
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        inputMode="numeric"
        autoComplete="one-time-code"
        autoFocus
        maxLength={6}
        placeholder={t("codePlaceholder")}
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
        className="text-center text-lg tracking-[0.5em]"
      />
      <Button
        type="submit"
        className="w-full"
        disabled={pending || code.length < 6}
      >
        {pending && <Loader2 className="size-4 animate-spin" />}
        {t("verify")}
      </Button>
    </form>
  );
}
