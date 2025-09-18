import Image from "next/image";
import {getTranslations} from 'next-intl/server';
import { ThemeToggle } from "@/src/widgets/theme-toggle";

export default async function Appointment({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  const t = await getTranslations({locale});

  return (
    <></>
  );
}
