"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

export function OAuthButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="outline"
      className="w-full"
      disabled={pending}
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : children}
    </Button>
  );
}
