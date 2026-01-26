/**
 * Утилиты для даты/времени в формате ISO 8601 с таймзоной.
 * Везде кроме UI — только ISO с ±HH:mm; конвертация в/из UI на границе.
 */

/**
 * Строка смещения таймзоны в формате ±HH:mm из getTimezoneOffset().
 * Например: +05:00, -03:00.
 */
export function getTimezoneOffsetString(): string {
  const offsetMin = -new Date().getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  const h = Math.floor(Math.abs(offsetMin) / 60);
  const m = Math.abs(offsetMin) % 60;
  return `${sign}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Собирает start_at в формате ISO 8601 с таймзоной: YYYY-MM-DDTHH:mm:00.000±HH:mm.
 * @param date — yyyy-MM-dd
 * @param time — HH:mm
 */
export function toStartAtISO(date: string, time: string): string {
  const tz = getTimezoneOffsetString();
  return `${date}T${time}:00.000${tz}`;
}

/**
 * Из полного ISO datetime извлекает дату yyyy-MM-dd для UI (календарь, isSameDay).
 * Если строка содержит T — берём slice(0,10), иначе возвращаем как есть (уже yyyy-MM-dd).
 */
export function parseDateFromISO(iso: string): string {
  return iso.includes("T") ? iso.slice(0, 10) : iso;
}

/**
 * Из полного ISO datetime или "HH:mm" извлекает время HH:mm для UI (кнопки, form.time).
 * Если есть T — извлекаем HH:mm regex'ом, иначе считаем, что это уже HH:mm.
 */
export function parseTimeFromISO(iso: string): string {
  if (iso.includes("T")) {
    const m = iso.match(/T(\d{2}:\d{2})/);
    return m ? m[1] : iso;
  }
  return iso;
}
