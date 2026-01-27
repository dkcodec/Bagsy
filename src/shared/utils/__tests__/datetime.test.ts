/**
 * Unit-тесты для утилит даты/времени (ISO 8601 с таймзоной)
 */

import {
  getTimezoneOffsetString,
  toStartAtISO,
  parseDateFromISO,
  parseTimeFromISO,
} from "../datetime";

describe("datetime", () => {
  describe("getTimezoneOffsetString", () => {
    it("возвращает +05:00 при getTimezoneOffset = -300", () => {
      jest.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(-300);
      expect(getTimezoneOffsetString()).toBe("+05:00");
      jest.restoreAllMocks();
    });

    it("возвращает -03:00 при getTimezoneOffset = 180", () => {
      jest.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(180);
      expect(getTimezoneOffsetString()).toBe("-03:00");
      jest.restoreAllMocks();
    });

    it("возвращает +00:00 при getTimezoneOffset = 0", () => {
      jest.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(0);
      expect(getTimezoneOffsetString()).toBe("+00:00");
      jest.restoreAllMocks();
    });
  });

  describe("toStartAtISO", () => {
    it("собирает ISO с таймзоной из date и time", () => {
      jest.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(-300);
      expect(toStartAtISO("2025-01-15", "14:30")).toBe(
        "2025-01-15T14:30:00.000+05:00"
      );
      jest.restoreAllMocks();
    });

    it("использует текущий offset", () => {
      jest.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(60);
      expect(toStartAtISO("2025-01-15", "09:00")).toBe(
        "2025-01-15T09:00:00.000-01:00"
      );
      jest.restoreAllMocks();
    });
  });

  describe("parseDateFromISO", () => {
    it("из полного ISO возвращает yyyy-MM-dd", () => {
      expect(parseDateFromISO("2025-01-15T00:00:00.000+05:00")).toBe(
        "2025-01-15"
      );
    });

    it("если уже yyyy-MM-dd — возвращает как есть", () => {
      expect(parseDateFromISO("2025-01-15")).toBe("2025-01-15");
    });
  });

  describe("parseTimeFromISO", () => {
    it("из полного ISO извлекает HH:mm", () => {
      expect(parseTimeFromISO("2025-01-15T15:00:00.000+05:00")).toBe("15:00");
    });

    it("если уже HH:mm — возвращает как есть", () => {
      expect(parseTimeFromISO("15:00")).toBe("15:00");
    });

    it("корректно обрабатывает время до полудня", () => {
      expect(parseTimeFromISO("2025-01-15T09:30:00.000-03:00")).toBe("09:30");
    });
  });
});
