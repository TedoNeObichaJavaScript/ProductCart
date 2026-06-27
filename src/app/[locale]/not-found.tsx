import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("Errors");

  return (
    <div className="grid min-h-[70vh] place-items-center px-4 text-center">
      <div className="max-w-md space-y-4">
        <p className="text-6xl font-bold text-primary">404</p>
        <h1 className="text-2xl font-bold tracking-tight">
          {t("notFoundTitle")}
        </h1>
        <p className="text-muted-foreground">{t("notFoundDescription")}</p>
        <Button asChild>
          <Link href="/">{t("backHome")}</Link>
        </Button>
      </div>
    </div>
  );
}
