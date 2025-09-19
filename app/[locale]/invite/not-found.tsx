"use client";
import { Button } from "@/src/entities/button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

export default function NotFound() {
  const t = useTranslations("InviteForm.NotFound");

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="text-center">
        <h1 className="mb-2 text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground mb-2">{t("description")}</p>

        <Button asChild>
          <Link href="/">{t("button")}</Link>
        </Button>
      </div>
    </div>
  );
}
