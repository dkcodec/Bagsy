"use client";

import * as React from "react";
import { Button } from "@/entities/button";
import { Input } from "@/entities/input";
import { ScrollArea } from "@/entities/scroll-area";
import { cn } from "@/shared/utils/styles";

const COUNTRIES = [
  { code: "KZ", name: "Kazakhstan", callingCode: "7" },
  { code: "RU", name: "Russia", callingCode: "7" },
  { code: "US", name: "United States", callingCode: "1" },
  { code: "TR", name: "Türkiye", callingCode: "90" },
  { code: "GB", name: "United Kingdom", callingCode: "44" },
] as const;

type Country = (typeof COUNTRIES)[number];

const COUNTRY_PATTERNS: Record<Country["code"], string> = {
  KZ: "(XXX) XXX-XX-XX",
  RU: "(XXX) XXX-XX-XX",
  US: "(XXX) XXX-XXXX",
  TR: "(XXX) XXX XX XX",
  GB: "(XXXX) XXX XXXX",
};

const countryCodeToFlag = (isoCode: string) =>
  isoCode
    .toUpperCase()
    .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)));

const onlyDigits = (value: string) => value.replace(/\D+/g, "");

const toE164 = (callingCode: string, nationalDigits: string) =>
  nationalDigits ? `+${callingCode}${nationalDigits}` : "";

const formatNationalWithPattern = (digits: string, pattern: string) => {
  let result = "";
  let di = 0;
  for (let i = 0; i < pattern.length; i++) {
    const ch = pattern[i];
    if (ch === "X") {
      if (di < digits.length) {
        result += digits[di++];
      } else {
        break;
      }
    } else {
      if (di === 0 && (ch === " " || ch === "-" || ch === ")")) {
        continue;
      }
      result += ch;
    }
  }
  return result.trim();
};

const extractNationalFromDisplay = (display: string, callingCode: string) => {
  const digits = onlyDigits(display);
  return digits.startsWith(callingCode)
    ? digits.slice(callingCode.length)
    : digits;
};

const formatDisplay = (
  callingCode: string,
  nationalDigits: string,
  countryCode: Country["code"]
) => {
  const pattern = COUNTRY_PATTERNS[countryCode];
  const limited = nationalDigits.slice(0, (pattern.match(/X/g) || []).length);
  const masked = formatNationalWithPattern(limited, pattern);
  return masked ? `+${callingCode} ${masked}` : `+${callingCode}`;
};

export type PhoneInputValue = string;

export interface PhoneInputProps
  extends Omit<React.ComponentProps<typeof Input>, "onChange" | "value"> {
  value?: PhoneInputValue;
  onChange?: (value: PhoneInputValue) => void;
  defaultCountryCode?: Country["code"];
  countries?: ReadonlyArray<Country>;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      className,
      value,
      onChange,
      defaultCountryCode = "KZ",
      countries = COUNTRIES,
      placeholder = "Enter phone number",
      disabled,
      ...props
    },
    ref
  ) => {
    const [country, setCountry] = React.useState<Country>(() => {
      return countries.find(c => c.code === defaultCountryCode) || countries[0];
    });

    const [open, setOpen] = React.useState(false);

    const nationalFromValue = React.useMemo(() => {
      const digits = onlyDigits(value || "");
      if (!digits.startsWith(country.callingCode)) return "";
      return digits.slice(country.callingCode.length);
    }, [value, country.callingCode]);

    const [display, setDisplay] = React.useState(
      formatDisplay(country.callingCode, nationalFromValue, country.code)
    );

    React.useEffect(() => {
      setDisplay(
        formatDisplay(country.callingCode, nationalFromValue, country.code)
      );
    }, [country.callingCode, country.code, nationalFromValue]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const digits = onlyDigits(raw);
      const stripped = digits.startsWith(country.callingCode)
        ? digits.slice(country.callingCode.length)
        : digits;
      const pattern = COUNTRY_PATTERNS[country.code];
      const limit = (pattern.match(/X/g) || []).length;
      const nextNational = stripped.slice(0, limit);
      const nextE164 = toE164(country.callingCode, nextNational);
      setDisplay(
        formatDisplay(country.callingCode, nextNational, country.code)
      );
      onChange?.(nextE164);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Backspace" || e.ctrlKey || e.metaKey || e.altKey) return;
      const input = e.currentTarget;
      const selStart = input.selectionStart ?? 0;
      const selEnd = input.selectionEnd ?? 0;
      if (selStart !== selEnd || selEnd !== display.length) return;
      const currentNational = extractNationalFromDisplay(
        display,
        country.callingCode
      );
      if (!currentNational) return;
      e.preventDefault();
      const nextNational = currentNational.slice(0, -1);
      const nextE164 = toE164(country.callingCode, nextNational);
      setDisplay(
        formatDisplay(country.callingCode, nextNational, country.code)
      );
      onChange?.(nextE164);
    };

    const changeCountry = (next: Country) => {
      if (next.code === country.code) return;
      const nextPattern = COUNTRY_PATTERNS[next.code];
      const limit = (nextPattern.match(/X/g) || []).length;
      const nationalDigits = nationalFromValue.slice(0, limit);
      setCountry(next);
      const nextE164 = toE164(next.callingCode, nationalDigits);
      setDisplay(formatDisplay(next.callingCode, nationalDigits, next.code));
      onChange?.(nextE164);
    };

    return (
      <div className={cn("relative flex", className)}>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "rounded-e-none rounded-s-md border-r-0 px-3 text-sm bg-transparen",
            "h-9"
          )}
          onClick={() => setOpen(s => !s)}
          disabled={disabled}
        >
          <span className="mr-2">{countryCodeToFlag(country.code)}</span>
          <span className="text-foreground/70">+{country.callingCode}</span>
        </Button>

        <Input
          ref={ref}
          value={display}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="rounded-s-none"
          inputMode="tel"
          {...props}
        />

        {open && !disabled ? (
          <div
            className={cn(
              "absolute z-50 mt-1 w-[300px] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
              "left-0 top-full"
            )}
            role="listbox"
          >
            <ScrollArea>
              <ul className="p-1">
                {countries.map(c => (
                  <li key={c.code}>
                    <button
                      type="button"
                      className={cn(
                        "flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm",
                        c.code === country.code
                          ? "bg-transparent  text-accent-foreground"
                          : "hover:bg-accent hover:text-accent-foreground"
                      )}
                      onClick={() => {
                        changeCountry(c);
                        setOpen(false);
                      }}
                    >
                      <span className="h-4 w-6 text-center">
                        {countryCodeToFlag(c.code)}
                      </span>
                      <span className="flex-1">{c.name}</span>
                      <span className="text-foreground/60">
                        +{c.callingCode}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        ) : null}

        {open ? (
          <button
            aria-hidden
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
        ) : null}
      </div>
    );
  }
);
PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
