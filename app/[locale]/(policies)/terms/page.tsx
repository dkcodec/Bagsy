import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/entities/breadcrumb";

// Локализованные метаданные берутся из messages через next-intl
export async function generateMetadata() {
  const t = await getTranslations("TermsPage");
  return { title: t("metaTitle") };
}

// Полностью локализованная страница через next-intl ключи
export default async function TermsPage() {
  const locale = await getLocale();
  const t = await getTranslations("TermsPage");
  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/${locale}`}
              className=" hover:text-accent-500"
            >
              {t("home")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/terms" className=" hover:text-accent-500">
              {t("heading")}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Заголовок и дата обновления */}
      <header className="mb-8">
        <h1 className="text-3xl font-semibold">{t("heading")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("updatedAt")}</p>
      </header>

      {/* Краткое введение */}
      <p className="mb-6 text-base leading-7">{t("intro")}</p>

      {/* Разделы как нумерованный список для лучшей навигации */}
      <ol className="space-y-6 list-decimal pl-5">
        <li>
          <h2 className="text-xl font-medium mb-2">
            {t("sections.general.title")}
          </h2>
          {/* Рендерим массив абзацев, если ключ — массив; иначе показываем строку */}
          {(() => {
            const raw = t.raw("sections.general.text");
            if (Array.isArray(raw)) {
              return (
                <div className="leading-7 space-y-1">
                  {raw.map((paragraph: string, idx: number) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              );
            }
            return <p className="leading-7">{String(raw)}</p>;
          })()}
        </li>

        <li>
          <h2 className="text-xl font-medium mb-2">
            {t("sections.access.title")}
          </h2>
          {(() => {
            const raw = t.raw("sections.access.text");
            if (Array.isArray(raw)) {
              return (
                <div className="leading-7 space-y-1">
                  {raw.map((paragraph: string, idx: number) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              );
            }
            return <p className="leading-7">{String(raw)}</p>;
          })()}
        </li>

        <li>
          <h2 className="text-xl font-medium mb-2">
            {t("sections.restrictions.title")}
          </h2>
          {(() => {
            const raw = t.raw("sections.restrictions.text");
            if (Array.isArray(raw)) {
              return (
                <div className="leading-7 space-y-1">
                  {raw.map((paragraph: string, idx: number) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              );
            }
            return <p className="leading-7">{String(raw)}</p>;
          })()}
        </li>

        <li>
          <h2 className="text-xl font-medium mb-2">{t("sections.ip.title")}</h2>
          {(() => {
            const raw = t.raw("sections.ip.text");
            if (Array.isArray(raw)) {
              return (
                <div className="leading-7 space-y-1">
                  {raw.map((paragraph: string, idx: number) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              );
            }
            return <p className="leading-7">{String(raw)}</p>;
          })()}
        </li>

        <li>
          <h2 className="text-xl font-medium mb-2">
            {t("sections.liability.title")}
          </h2>
          {(() => {
            const raw = t.raw("sections.liability.text");
            if (Array.isArray(raw)) {
              return (
                <div className="leading-7 space-y-1">
                  {raw.map((paragraph: string, idx: number) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              );
            }
            return <p className="leading-7">{String(raw)}</p>;
          })()}
        </li>

        <li>
          <h2 className="text-xl font-medium mb-2">
            {t("sections.changes.title")}
          </h2>
          {(() => {
            const raw = t.raw("sections.changes.text");
            if (Array.isArray(raw)) {
              return (
                <div className="leading-7 space-y-1">
                  {raw.map((paragraph: string, idx: number) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              );
            }
            return <p className="leading-7">{String(raw)}</p>;
          })()}
        </li>

        <li>
          <h2 className="text-xl font-medium mb-2">
            {t("sections.law.title")}
          </h2>
          {(() => {
            const raw = t.raw("sections.law.text");
            if (Array.isArray(raw)) {
              return (
                <div className="leading-7 space-y-1">
                  {raw.map((paragraph: string, idx: number) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              );
            }
            return <p className="leading-7">{String(raw)}</p>;
          })()}
        </li>
      </ol>

      {/* Ссылки на связанные документы */}
      <footer className="mt-10 border-t pt-6 text-sm text-muted-foreground">
        <p>
          {t("footer.prefix")}
          <Link
            href="/privacy"
            className="hover:underline hover:text-accent-500"
            hrefLang={locale}
          >
            {t("footer.privacy")}
          </Link>
          .
        </p>
      </footer>
    </main>
  );
}
