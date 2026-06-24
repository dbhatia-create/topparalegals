"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { contactSchema, type ContactFormData } from "@/lib/schema";
import { FormField, Input, Textarea } from "./FormField";
import { getTrafficSource } from "./TrafficSourceTracker";
import Button from "./Button";

const formatPhone = (val: string) => {
  const digits = val.replace(/\D/g, "");
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { type: "contact" },
  });

  async function onSubmit(data: ContactFormData) {
    setServerError(null);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-traffic-source": getTrafficSource(),
          "x-landing-page": window.location.pathname,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setServerError(body.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSent(true);
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl bg-teal/10 border border-teal/30 p-8 text-center">
        <p className="font-display text-xl font-bold text-navy mb-2">Message Sent!</p>
        <p className="text-muted text-sm">We respond promptly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <input type="text" aria-hidden tabIndex={-1} className="absolute opacity-0 h-0 w-0 pointer-events-none" {...register("_honeypot")} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField label="First Name" required error={errors.firstName?.message}>
          <Input {...register("firstName")} error={errors.firstName?.message} placeholder="Jane" />
        </FormField>
        <FormField label="Last Name" required error={errors.lastName?.message}>
          <Input {...register("lastName")} error={errors.lastName?.message} placeholder="Doe" />
        </FormField>
      </div>

      <FormField label="Email Address" required error={errors.email?.message}>
        <Input {...register("email")} type="email" error={errors.email?.message} placeholder="jane@youragency.com" />
      </FormField>

      <FormField label="Phone" required error={errors.phone?.message}>
        <Input
          {...register("phone")}
          onChange={(e) => {
            e.target.value = formatPhone(e.target.value);
            register("phone").onChange(e);
          }}
          type="tel"
          error={errors.phone?.message}
          placeholder="(555) 000-0000"
        />
      </FormField>

      <FormField label="Message" required error={errors.message?.message}>
        <Textarea {...register("message")} error={errors.message?.message} rows={4} placeholder="How can we help you?" />
      </FormField>

      <div className="space-y-1">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" {...register("consentToContact")} className="mt-0.5 h-4 w-4 rounded accent-teal flex-shrink-0" />
          <span className="text-sm text-muted leading-snug">
            I consent to being contacted by the TopParalegals.com team by email and phone regarding my inquiry.
          </span>
        </label>
        {errors.consentToContact && (
          <p className="text-xs text-red-600 pl-7">{errors.consentToContact.message}</p>
        )}
      </div>

      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
          {serverError}
        </div>
      )}

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
