"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/entities/form";
import { Input } from "@/entities/input";
import { Textarea } from "@/entities/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/entities/select";
import { Button } from "@/entities/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/entities/card";
import { Badge } from "@/entities/badge";
import { Mail, MapPin, Phone, Rocket, Clock } from "lucide-react";
import { formatPhone } from "@/shared/utils/formater";
import { PhoneInput } from "@/src/widgets/forms/phone-input";
import { apiClient } from "@/src/shared/api/client";

const createContactSchema = (messages: {
  firstNameRequired: string;
  lastNameRequired: string;
  phoneRequired: string;
  phoneInvalid: string;
  roleRequired: string;
  descriptionRequired: string;
  descriptionMin: string;
}) =>
  z.object({
    first_name: z
      .string()
      .trim()
      .min(1, { message: messages.firstNameRequired }),
    last_name: z.string().trim().min(1, { message: messages.lastNameRequired }),
    phone: z
      .string()
      .trim()
      .min(1, { message: messages.phoneRequired })
      .regex(/^\+?[0-9\s().-]{7,}$/, {
        message: messages.phoneInvalid,
      }),
    role: z.string().min(1, { message: messages.roleRequired }),
    description: z
      .string()
      .trim()
      .min(1, { message: messages.descriptionRequired })
      .refine(value => value.length >= 10, {
        message: messages.descriptionMin,
      }),
  });

type ContactFormValues = z.infer<ReturnType<typeof createContactSchema>>;

type ContactRoleOption = {
  value: string;
  label: string;
};
export function LandingContact() {
  const t = useTranslations("Landing.contact");

  const schema = useMemo(
    () =>
      createContactSchema({
        firstNameRequired: t("errors.firstName"),
        lastNameRequired: t("errors.lastName"),
        phoneRequired: t("errors.phoneRequired"),
        phoneInvalid: t("errors.phoneInvalid"),
        roleRequired: t("errors.role"),
        descriptionRequired: t("errors.descriptionRequired"),
        descriptionMin: t("errors.descriptionMin"),
      }),
    [t]
  );

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      role: "",
      description: "",
    },
  });

  const roles = useMemo(() => {
    const raw = t.raw("roles");

    if (Array.isArray(raw)) {
      return raw.filter((item): item is ContactRoleOption => {
        return (
          typeof item === "object" &&
          item !== null &&
          typeof (item as ContactRoleOption).value === "string" &&
          typeof (item as ContactRoleOption).label === "string"
        );
      });
    }

    return [] as ContactRoleOption[];
  }, [t]);

  const highlights = useMemo(() => {
    const raw = t.raw("highlights");

    if (Array.isArray(raw)) {
      return raw.filter((item): item is string => typeof item === "string");
    }

    return [] as string[];
  }, [t]);

  const contactEmail = process.env.NEXT_PUBLIC_EMAIL ?? "";
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER ?? "";
  const formattedPhone = phoneNumber ? formatPhone(phoneNumber) : "";

  const onSubmit = async (values: ContactFormValues) => {
    try {
      await apiClient.post("v1/forms", values);

      toast.success(t("success.title"), {
        description: t("success.description"),
      });
      form.reset();
    } catch (error) {
      toast.error(t("errors.submit"));
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-background via-accent-50/50 to-background dark:from-background dark:via-accent-950/40 dark:to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="text-xs flex items-center gap-2"
                >
                  <Clock className="h-4 w-4" />

                  {t("badge")}
                </Badge>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                {t("title")}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {t("subtitle")}
              </p>
            </div>

            {highlights.length > 0 && (
              <ul className="space-y-4">
                {highlights.map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <Rocket className="mt-1 h-5 w-5 text-accent-500" />
                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-xl border border-accent-200/60 dark:border-accent-800/60 bg-white/80 dark:bg-accent-950/50 px-4 py-3">
                <Mail className="h-5 w-5 text-accent-500" />
                <div>
                  <p className="text-xs uppercase text-gray-500 dark:text-gray-400">
                    {t("contactInfo.email")}
                  </p>
                  {contactEmail ? (
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {contactEmail}
                    </a>
                  ) : (
                    <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
                      {t("contactInfo.emailPlaceholder")}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-accent-200/60 dark:border-accent-800/60 bg-white/80 dark:bg-accent-950/50 px-4 py-3">
                <Phone className="h-5 w-5 text-accent-500" />
                <div>
                  <p className="text-xs uppercase text-gray-500 dark:text-gray-400">
                    {t("contactInfo.phone")}
                  </p>
                  {phoneNumber ? (
                    <a
                      href={`tel:+${phoneNumber}`}
                      className="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      {formattedPhone}
                    </a>
                  ) : (
                    <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
                      {t("contactInfo.phonePlaceholder")}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-accent-200/60 dark:border-accent-800/60 bg-white/80 dark:bg-accent-950/50 px-4 py-3 sm:col-span-2">
                <MapPin className="h-5 w-5 text-accent-500" />
                <div>
                  <p className="text-xs uppercase text-gray-500 dark:text-gray-400">
                    {t("contactInfo.location")}
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {t("contactInfo.locationValue")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card className="backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-accent-950/70 border-accent-200/60 dark:border-accent-800/60 shadow-xl relative overflow-hidden">
            {/* Индикатор разработки */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-accent-500 to-amber-400">
              <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>

            <CardHeader className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {t("form.title")}
                </CardTitle>
              </div>
              <CardDescription>{t("form.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("fields.firstName.label")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("fields.firstName.placeholder")}
                              autoComplete="given-name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("fields.lastName.label")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("fields.lastName.placeholder")}
                              autoComplete="family-name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fields.phone.label")}</FormLabel>
                        <FormControl>
                          <PhoneInput
                            type="tel"
                            inputMode="tel"
                            placeholder={t("fields.phone.placeholder")}
                            autoComplete="tel"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("fields.phone.hint")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fields.role.label")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || undefined}
                          onOpenChange={open => {
                            if (!open) {
                              field.onBlur();
                            }
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t("fields.role.placeholder")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roles.map(role => (
                              <SelectItem key={role.value} value={role.value}>
                                {role.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fields.description.label")}</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder={t("fields.description.placeholder")}
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {t("fields.description.hint")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    size="lg"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        {t("form.submitting")}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Rocket className="h-4 w-4" />
                        {t("form.submit")}
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
