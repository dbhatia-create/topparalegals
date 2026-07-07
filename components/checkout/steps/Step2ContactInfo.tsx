"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FadeIn from "@/components/ui/FadeIn";
import Button from "@/components/ui/Button";
import { FormField, Input, Textarea, Select } from "@/components/ui/FormField";
import { useCheckoutStore } from "@/lib/store/checkoutStore";
import { contactSchema } from "@/lib/checkoutSchema";
import { ALL_STATES } from "@/lib/checkoutMarkets";
import type { SiteConfig } from "@/lib/config";

interface FormValues {
  firstName: string;
  lastName: string;
  title?: string;
  email: string;
  phone: string;
  notes?: string;
  plaqueStreet?: string;
  plaqueCity?: string;
  plaqueState?: string;
  plaqueZip?: string;
}

export default function Step2ContactInfo({ config }: { config: SiteConfig }) {
  const contact = useCheckoutStore((s) => s.contact);
  const plaqueShipping = useCheckoutStore((s) => s.plaqueShipping);
  const setContact = useCheckoutStore((s) => s.setContact);
  const setPlaqueShipping = useCheckoutStore((s) => s.setPlaqueShipping);
  const goNext = useCheckoutStore((s) => s.goNext);
  const goBack = useCheckoutStore((s) => s.goBack);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(contactSchema) as unknown as Resolver<FormValues>,
    defaultValues: {
      ...contact,
      plaqueStreet: plaqueShipping?.street ?? "",
      plaqueCity: plaqueShipping?.city ?? "",
      plaqueState: plaqueShipping?.state ?? "",
      plaqueZip: plaqueShipping?.zip ?? "",
    },
  });

  function onSubmit(values: FormValues) {
    setContact({
      firstName: values.firstName,
      lastName: values.lastName,
      title: values.title ?? "",
      email: values.email,
      phone: values.phone,
      notes: values.notes ?? "",
    });

    setPlaqueShipping({
      street: values.plaqueStreet ?? "",
      city: values.plaqueCity ?? "",
      state: values.plaqueState ?? "",
      zip: values.plaqueZip ?? "",
    });
    goNext();
  }

  return (
    <FadeIn>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <div>
          <h2 className="text-lg font-semibold text-primary mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="First Name" required error={errors.firstName?.message}>
              <Input {...register("firstName")} error={errors.firstName?.message} placeholder="Jane" />
            </FormField>
            <FormField label="Last Name" required error={errors.lastName?.message}>
              <Input {...register("lastName")} error={errors.lastName?.message} placeholder="Smith" />
            </FormField>
            <FormField label="Title / Role" error={errors.title?.message}>
              <Input {...register("title")} error={errors.title?.message} placeholder="Owner, Senior Paralegal, Legal Support Specialist…" />
            </FormField>
            <FormField label="Email Address" required error={errors.email?.message}>
              <Input type="email" {...register("email")} error={errors.email?.message} placeholder="jane@yourfirm.com" />
            </FormField>
            <FormField label="Phone Number" required error={errors.phone?.message}>
              <Input type="tel" {...register("phone")} error={errors.phone?.message} placeholder="(555) 000-0000" />
            </FormField>
          </div>
          <div className="mt-4">
            <FormField label="Notes / Special Instructions" error={errors.notes?.message}>
              <Textarea {...register("notes")} error={errors.notes?.message} placeholder="Anything else we should know?" />
            </FormField>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-primary mb-1">Complimentary Plaque Delivery</h2>
          <p className="text-sm text-muted mb-4">
            Where should we ship your complimentary custom recognition plaque?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Street"
              required
              className="sm:col-span-2"
              error={errors.plaqueStreet?.message}
            >
              <Input {...register("plaqueStreet")} error={errors.plaqueStreet?.message} placeholder="123 Main St, Suite 400" />
            </FormField>
            <FormField label="City" required error={errors.plaqueCity?.message}>
              <Input {...register("plaqueCity")} error={errors.plaqueCity?.message} placeholder="Dallas" />
            </FormField>
            <FormField label="State" required error={errors.plaqueState?.message}>
              <Select {...register("plaqueState")} error={errors.plaqueState?.message}>
                <option value="">Select…</option>
                {ALL_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="ZIP Code" required error={errors.plaqueZip?.message}>
              <Input {...register("plaqueZip")} error={errors.plaqueZip?.message} placeholder="75201" />
            </FormField>
          </div>
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="ghost" onClick={goBack}>
            Back
          </Button>
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </FadeIn>
  );
}
