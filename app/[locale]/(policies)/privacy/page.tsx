import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/src/entities/breadcrumb";

// Локализованные метаданные берутся из messages через next-intl
export async function generateMetadata() {
  const t = await getTranslations("PrivacyPage");
  return { title: t("metaTitle") };
}

// Полностью локализованная страница через next-intl ключи
export default async function PrivacyPage() {
  const t = await getTranslations("PrivacyPage");
  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className=" hover:text-accent-500">
              {t("home")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/privacy" className=" hover:text-accent-500">
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
            {t("sections.intro.title")}
          </h2>
          {/* Рендерим массив абзацев, если ключ — массив; иначе показываем строку */}
          {(() => {
            const raw = t.raw("sections.intro.text");
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
            {t("sections.data.title")}
          </h2>
          {(() => {
            const raw = t.raw("sections.data.text");
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
            {t("sections.purposes.title")}
          </h2>
          {(() => {
            const raw = t.raw("sections.purposes.text");
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
            {t("sections.transfer.title")}
          </h2>
          {(() => {
            const raw = t.raw("sections.transfer.text");
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
            {t("sections.storage.title")}
          </h2>
          {(() => {
            const raw = t.raw("sections.storage.text");
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
            {t("sections.rights.title")}
          </h2>
          {(() => {
            const raw = t.raw("sections.rights.text");
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
            {t("sections.cookies.title")}
          </h2>
          {(() => {
            const raw = t.raw("sections.cookies.text");
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
          <Link href="/terms" className="hover:underline hover:text-accent-500">
            {t("footer.terms")}
          </Link>
          .
        </p>
      </footer>
    </main>
  );
}
