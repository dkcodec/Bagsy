import { LoginForm } from "@/src/all-pages/exports";
import { getIsMobile } from "@/src/shared/hooks/use-mobile-server";
import LoginBackground from "@/src/widgets/login-background";
import React from "react";

export default async function LoginPage() {
  const isMobile = await getIsMobile();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <LoginBackground isMobile={isMobile} />

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
