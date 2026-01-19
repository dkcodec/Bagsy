import { AppointmentFlow } from "@/features/appointment";
import { AppointmentHeader } from "@/src/features/appointment/ui/appointment-header";

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
    <>
      <AppointmentHeader />
      <main className="pt-16 max-w-7xl mx-auto">
        <div className="container mx-auto py-8 px-3 sm:px-4 lg:px-8">
          <AppointmentFlow pointCode={pointCode} />
        </div>
      </main>
    </>
  );
}
