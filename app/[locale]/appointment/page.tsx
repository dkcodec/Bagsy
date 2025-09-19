import { getTranslations } from "next-intl/server";

export default async function Appointment({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return <></>;
}
