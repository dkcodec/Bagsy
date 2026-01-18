import { AppointmentFlow } from "@/features/appointment";

/**
 * Страница записи на прием
 * SSR страница с динамическим параметром pointCode
 */
export default async function AppointmentPage({
  params,
}: {
  params: Promise<{ pointCode: string }>;
}) {
  const { pointCode } = await params;

  return (
    <div className="container mx-auto py-8 px-3 sm:px-4 lg:px-8">
      <AppointmentFlow pointCode={pointCode} />
    </div>
  );
}
