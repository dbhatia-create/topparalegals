"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Scale, ChevronRight, ChevronLeft } from "lucide-react";
import { applySchema, type ApplyFormData } from "@/lib/schema";
import { FormField, Input, Textarea, Select } from "./FormField";
import CityCombobox from "./CityCombobox";
import ServicesSelect from "./ServicesSelect";
import PricingEstimate from "./PricingEstimate";
import Button from "./Button";
import { getTrafficSource } from "./TrafficSourceTracker";

const US_STATES = [
  ["AL","Alabama"],["AK","Alaska"],["AZ","Arizona"],["AR","Arkansas"],["CA","California"],
  ["CO","Colorado"],["CT","Connecticut"],["DE","Delaware"],["FL","Florida"],["GA","Georgia"],
  ["HI","Hawaii"],["ID","Idaho"],["IL","Illinois"],["IN","Indiana"],["IA","Iowa"],
  ["KS","Kansas"],["KY","Kentucky"],["LA","Louisiana"],["ME","Maine"],["MD","Maryland"],
  ["MA","Massachusetts"],["MI","Michigan"],["MN","Minnesota"],["MS","Mississippi"],["MO","Missouri"],
  ["MT","Montana"],["NE","Nebraska"],["NV","Nevada"],["NH","New Hampshire"],["NJ","New Jersey"],
  ["NM","New Mexico"],["NY","New York"],["NC","North Carolina"],["ND","North Dakota"],["OH","Ohio"],
  ["OK","Oklahoma"],["OR","Oregon"],["PA","Pennsylvania"],["RI","Rhode Island"],["SC","South Carolina"],
  ["SD","South Dakota"],["TN","Tennessee"],["TX","Texas"],["UT","Utah"],["VT","Vermont"],
  ["VA","Virginia"],["WA","Washington"],["WV","West Virginia"],["WI","Wisconsin"],["WY","Wyoming"],
  ["DC","District of Columbia"],
] as const;

const STEP_TITLES = ["Business Details", "Contact Info", "Legal Specialties & Cities", "Billing"];

const formatPhone = (val: string) => {
  const d = val.replace(/\D/g, "");
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
};

const formatCard = (val: string) =>
  val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

const formatExpiry = (val: string) => {
  const d = val.replace(/\D/g, "").slice(0, 4);
  if (d.length >= 3) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return d;
};

export default function ApplyForm() {
  const [step, setStep] = useState(1);
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<ApplyFormData>({
    resolver: zodResolver(applySchema),
    defaultValues: {
      type: "apply",
      locations: [{ city: "", state: "" }],
      services: [],
      featuredPlacement: true,
      excludedFeatured: [],
      assetPermission: undefined,
    },
    mode: "onTouched",
  });

  const { fields: locFields, append: addLocation, remove: removeLocation } = useFieldArray({ control, name: "locations" });

  const watchedServices = watch("services");
  const watchedLocations = watch("locations");
  const watchedFeatured = watch("featuredPlacement");
  const watchedExcluded = watch("excludedFeatured");

  const checkCityAvailability = useCallback(async (city: string, state: string) => {
    if (!city || !state) return;
    try {
      const params = new URLSearchParams({ city, state });
      const res = await fetch(`/api/cities/availability?${params}`);
      if (!res.ok) return;
      const data = await res.json();
      const taken: boolean = data.taken ?? false;
      const key = `${city}|${state}`;
      setTakenSlots((prev) => {
        if (taken && !prev.includes(key)) return [...prev, key];
        if (!taken) return prev.filter((s) => s !== key);
        return prev;
      });
    } catch {
      // fail open
    }
  }, []);

  useEffect(() => {
    if (!watchedFeatured) return;
    getValues("locations").forEach((loc) => {
      if (loc.city && loc.state) checkCityAvailability(loc.city, loc.state);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedFeatured]);

  async function goNext() {
    const stepFields: (keyof ApplyFormData)[][] = [
      ["businessName", "businessPhone", "assetPermission"],
      ["contactFirstName", "contactLastName", "email", "contactPhone", "plaqueShippingAddress", "plaqueShippingCity", "plaqueShippingState", "plaqueShippingZip"],
      ["locations", "services"],
      ["cardNumber", "cardExpiry", "cardCvc", "cardName", "billingAddress", "billingCity", "billingState", "billingZip", "consentToTerms"],
    ];
    const valid = await trigger(stepFields[step - 1]);
    if (valid) setStep((s) => Math.min(s + 1, 4));
  }

  function goBack() { setStep((s) => Math.max(s - 1, 1)); }

  function toggleFeatured(key: string) {
    const current = getValues("excludedFeatured") ?? [];
    setValue("excludedFeatured", current.includes(key) ? current.filter((k) => k !== key) : [...current, key], { shouldDirty: true });
  }

  async function onSubmit(data: ApplyFormData) {
    setServerError(null);
    const currentExcluded = getValues("excludedFeatured") ?? [];
    const finalExcluded = [...new Set([...currentExcluded, ...takenSlots])];
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-traffic-source": getTrafficSource(),
          "x-landing-page": window.location.pathname,
        },
        body: JSON.stringify({ ...data, excludedFeatured: finalExcluded }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setServerError(body.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-teal/30 bg-teal/5 p-10 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal/20">
          <Scale className="h-8 w-8 text-teal" />
        </div>
        <h2 className="font-display text-2xl font-bold text-navy">Application Received!</h2>
        <p className="text-muted text-sm max-w-md mx-auto leading-relaxed">
          We&apos;ll reach out if we need anything to finalize your listing. Questions? Call us at:{" "}
          <a href="tel:+18660000000" className="text-teal font-semibold hover:text-teal-dark">(866) 000-0000</a>
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-sky-dark bg-white shadow-sm overflow-hidden">
      {/* Step progress */}
      <div className="border-b border-sky-dark px-6 py-4 bg-sky">
        <div className="flex items-center justify-between max-w-lg mx-auto gap-1">
          {STEP_TITLES.map((title, i) => {
            const s = i + 1;
            const active = s === step;
            const done = s < step;
            return (
              <div key={title} className="flex items-center gap-1 sm:gap-2">
                <div className={`flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-xs font-bold transition-colors flex-shrink-0 ${
                  done ? "bg-teal text-white" : active ? "bg-navy text-white" : "bg-white border border-sky-dark text-muted"
                }`}>
                  {done ? "✓" : s}
                </div>
                <span className={`text-xs font-medium hidden sm:inline transition-colors ${active ? "text-navy" : done ? "text-teal" : "text-muted"}`}>{title}</span>
                {i < 3 && <ChevronRight className="h-3 w-3 text-muted mx-0.5 sm:mx-1 flex-shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <input type="text" aria-hidden tabIndex={-1} className="absolute opacity-0 h-0 w-0 pointer-events-none" {...register("_honeypot")} />

        <div className="p-6 sm:p-8">

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-navy mb-1">Business Details</h2>
                <p className="text-sm text-muted">Tell us about your paralegal services.</p>
              </div>

              <FormField label="Business Name" required error={errors.businessName?.message}>
                <Input {...register("businessName")} error={errors.businessName?.message} placeholder="Meridian Legal Support" />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField label="Business Phone" required error={errors.businessPhone?.message}>
                  <Input
                    {...register("businessPhone")}
                    onChange={(e) => { e.target.value = formatPhone(e.target.value); register("businessPhone").onChange(e); }}
                    type="tel" error={errors.businessPhone?.message} placeholder="(555) 000-0000"
                  />
                </FormField>
                <FormField label="Business Website" error={errors.website?.message}>
                  <Input {...register("website")} error={errors.website?.message} placeholder="https://yourfirm.com" type="url" />
                </FormField>
              </div>

              <div>
                <p className="text-sm font-semibold text-navy mb-3">Website Asset Permission <span className="text-red-500">*</span></p>
                <div className="space-y-3">
                  {(["grant", "support"] as const).map((val) => (
                    <label key={val} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${watch("assetPermission") === val ? "border-teal bg-teal/5" : "border-sky-dark hover:border-teal/40"}`}>
                      <input type="radio" value={val} {...register("assetPermission")} className="mt-0.5 h-4 w-4 accent-teal flex-shrink-0" />
                      <div>
                        {val === "grant" ? (
                          <>
                            <p className="font-semibold text-sm text-navy">I grant TopParalegals.com permission</p>
                            <p className="text-xs text-muted mt-0.5">to use photos, logos, and content from my website for my directory listing.</p>
                          </>
                        ) : (
                          <>
                            <p className="font-semibold text-sm text-navy">I&apos;d like your support team to contact me</p>
                            <p className="text-xs text-muted mt-0.5">to discuss assets and listing content.</p>
                          </>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
                {errors.assetPermission && <p className="text-xs text-red-600 mt-1.5">{errors.assetPermission.message}</p>}
              </div>
            </div>
          )}

          {/* Step 2 — Contact Info */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-navy mb-1">Contact Information</h2>
                <p className="text-sm text-muted">Your contact details for this listing.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField label="First Name" required error={errors.contactFirstName?.message}>
                  <Input {...register("contactFirstName")} error={errors.contactFirstName?.message} placeholder="Jane" />
                </FormField>
                <FormField label="Last Name" required error={errors.contactLastName?.message}>
                  <Input {...register("contactLastName")} error={errors.contactLastName?.message} placeholder="Smith" />
                </FormField>
              </div>
              <FormField label="Title / Role" hint="optional" error={errors.contactTitle?.message}>
                <Input {...register("contactTitle")} error={errors.contactTitle?.message} placeholder="Owner, Senior Paralegal, Legal Support Specialist…" />
              </FormField>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField label="Email Address" required error={errors.email?.message}>
                  <Input {...register("email")} type="email" error={errors.email?.message} placeholder="jane@yourfirm.com" />
                </FormField>
                <FormField label="Phone" required error={errors.contactPhone?.message}>
                  <Input {...register("contactPhone")} onChange={(e) => { e.target.value = formatPhone(e.target.value); register("contactPhone").onChange(e); }} type="tel" error={errors.contactPhone?.message} placeholder="(555) 000-0000" />
                </FormField>
              </div>
              <FormField label="Notes" hint="optional" error={errors.notes?.message}>
                <Textarea {...register("notes")} error={errors.notes?.message} rows={3} placeholder="Anything else we should know about your listing?" />
              </FormField>
              <div className="pt-4 border-t border-sky-dark">
                <h3 className="text-sm font-semibold text-navy mb-1">Complimentary Plaque Delivery</h3>
                <p className="text-xs text-muted mb-4">Where should we ship your complimentary custom recognition plaque?</p>
                <div className="space-y-5">
                  <FormField label="Street Address" required error={errors.plaqueShippingAddress?.message}>
                    <Input {...register("plaqueShippingAddress")} error={errors.plaqueShippingAddress?.message} placeholder="123 Main St, Suite 400" autoComplete="street-address" />
                  </FormField>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <FormField label="City" required error={errors.plaqueShippingCity?.message} className="sm:col-span-1">
                      <Input {...register("plaqueShippingCity")} error={errors.plaqueShippingCity?.message} placeholder="Dallas" autoComplete="address-level2" />
                    </FormField>
                    <FormField label="State" required error={errors.plaqueShippingState?.message}>
                      <Select {...register("plaqueShippingState")} error={errors.plaqueShippingState?.message} autoComplete="address-level1">
                        <option value="">State</option>
                        {US_STATES.map(([code]) => <option key={code} value={code}>{code}</option>)}
                      </Select>
                    </FormField>
                    <FormField label="ZIP Code" required error={errors.plaqueShippingZip?.message}>
                      <Input {...register("plaqueShippingZip")} error={errors.plaqueShippingZip?.message} placeholder="75201" maxLength={10} inputMode="numeric" autoComplete="postal-code" />
                    </FormField>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Legal Specialties & Cities */}
          {step === 3 && (
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-xl font-bold text-navy mb-1">Specialties & Cities</h2>
                <p className="text-sm text-muted">Select your service cities, legal support specialties, and listing type.</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-navy">Cities <span className="text-red-500">*</span></p>
                  <button type="button" onClick={() => addLocation({ city: "", state: "" })} className="inline-flex items-center gap-1 text-xs font-medium text-teal hover:text-teal-dark transition-colors">
                    <Plus className="h-3 w-3" /> Add City
                  </button>
                </div>
                <div className="space-y-3">
                  {locFields.map((field, i) => {
                    const stateVal = watch(`locations.${i}.state`) ?? "";
                    const lockedCities = (watchedLocations ?? []).filter((l, j) => j !== i && !!l.city && l.state === stateVal).map((l) => l.city);
                    return (
                      <div key={field.id} className="flex items-start gap-3">
                        <div className="flex-1 grid grid-cols-1 min-[400px]:grid-cols-2 gap-3">
                          <FormField label={i === 0 ? "State" : ""} required={i === 0} error={errors.locations?.[i]?.state?.message}>
                            <Select {...register(`locations.${i}.state`)} onChange={(e) => { register(`locations.${i}.state`).onChange(e); setValue(`locations.${i}.city`, ""); }} error={errors.locations?.[i]?.state?.message}>
                              <option value="">Select state</option>
                              {US_STATES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                            </Select>
                          </FormField>
                          <FormField label={i === 0 ? "City" : ""} required={i === 0} error={errors.locations?.[i]?.city?.message}>
                            <CityCombobox
                              state={stateVal}
                              value={watch(`locations.${i}.city`)}
                              excludedCities={lockedCities}
                              onChange={(city) => {
                                setValue(`locations.${i}.city`, city, { shouldValidate: true });
                                if (city && stateVal && watchedFeatured) checkCityAvailability(city, stateVal);
                              }}
                              error={errors.locations?.[i]?.city?.message}
                            />
                          </FormField>
                        </div>
                        {locFields.length > 1 && (
                          <button type="button" onClick={() => removeLocation(i)} className={`text-muted hover:text-red-500 transition-colors flex-shrink-0 ${i === 0 ? "mt-7" : "mt-1"}`} aria-label="Remove city">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-navy mb-1">Legal Support Specialties <span className="text-red-500">*</span></p>
                <p className="text-xs text-muted mb-3">Select all specialties your practice supports. These appear on your listing and do not affect pricing.</p>
                <ServicesSelect
                  value={watchedServices}
                  onChange={(selected) => setValue("services", selected, { shouldValidate: true })}
                  error={errors.services?.message as string}
                />
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("featuredPlacement")}
                    className="h-5 w-5 rounded accent-teal flex-shrink-0"
                    onChange={(e) => {
                      register("featuredPlacement").onChange(e);
                      if (!e.target.checked) { setTakenSlots([]); setValue("excludedFeatured", []); }
                      else { getValues("locations").forEach((loc) => { if (loc.city && loc.state) checkCityAvailability(loc.city, loc.state); }); }
                    }}
                  />
                  <div>
                    <p className="font-semibold text-sm text-navy">Include Featured Listing</p>
                    <p className="text-xs text-muted mt-0.5">Pins your services at the top of each city page. $689 first city, $345 each additional. Only 1 per city.</p>
                  </div>
                </label>
              </div>

              <PricingEstimate cities={watchedLocations} featured={watchedFeatured} excludedFeatured={watchedExcluded ?? []} takenSlots={takenSlots} onToggleFeatured={toggleFeatured} />
            </div>
          )}


          {/* Step 4 */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-navy mb-1">Billing Details</h2>
                <p className="text-sm text-muted">Annual listing fee. Secure payment.</p>
              </div>
              <PricingEstimate cities={watchedLocations} featured={watchedFeatured} excludedFeatured={watchedExcluded ?? []} takenSlots={takenSlots} onToggleFeatured={toggleFeatured} />
              <div className="pt-2 space-y-4">
                <FormField label="Card Number" required error={errors.cardNumber?.message}>
                  <Input {...register("cardNumber")} onChange={(e) => { e.target.value = formatCard(e.target.value); register("cardNumber").onChange(e); }} error={errors.cardNumber?.message} placeholder="1234 5678 9012 3456" maxLength={19} inputMode="numeric" />
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Expiry Date" required error={errors.cardExpiry?.message}>
                    <Input {...register("cardExpiry")} onChange={(e) => { e.target.value = formatExpiry(e.target.value); register("cardExpiry").onChange(e); }} error={errors.cardExpiry?.message} placeholder="MM/YY" maxLength={5} inputMode="numeric" />
                  </FormField>
                  <FormField label="Security Code" required error={errors.cardCvc?.message}>
                    <Input {...register("cardCvc")} error={errors.cardCvc?.message} placeholder="CVV" maxLength={4} inputMode="numeric" />
                  </FormField>
                </div>
                <FormField label="Name on Card" required error={errors.cardName?.message}>
                  <Input {...register("cardName")} error={errors.cardName?.message} placeholder="Jane Smith" />
                </FormField>
                <p className="text-xs font-semibold text-muted uppercase tracking-wider pt-2">Billing Address</p>
                <FormField label="Street Address" required error={errors.billingAddress?.message}>
                  <Input {...register("billingAddress")} error={errors.billingAddress?.message} placeholder="123 Main St" />
                </FormField>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <FormField label="City" required error={errors.billingCity?.message} className="col-span-2 sm:col-span-1">
                    <Input {...register("billingCity")} error={errors.billingCity?.message} placeholder="Dallas" />
                  </FormField>
                  <FormField label="State" required error={errors.billingState?.message}>
                    <Select {...register("billingState")} error={errors.billingState?.message}>
                      <option value="">State</option>
                      {US_STATES.map(([code]) => <option key={code} value={code}>{code}</option>)}
                    </Select>
                  </FormField>
                  <FormField label="ZIP Code" required error={errors.billingZip?.message}>
                    <Input {...register("billingZip")} error={errors.billingZip?.message} placeholder="75201" />
                  </FormField>
                </div>
              </div>
              <div className="space-y-1">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" {...register("consentToTerms")} className="mt-0.5 h-4 w-4 rounded accent-teal flex-shrink-0" />
                  <span className="text-sm text-muted leading-snug">
                    I agree to the{" "}
                    <a href="/terms" target="_blank" className="text-teal font-medium underline hover:text-teal-dark">Terms of Service</a>{" "}
                    and{" "}
                    <a href="/privacy" target="_blank" className="text-teal font-medium underline hover:text-teal-dark">Privacy Policy</a>.
                    I understand that my listing fee is non-refundable.
                  </span>
                </label>
                {errors.consentToTerms && <p className="text-xs text-red-600 pl-7">{errors.consentToTerms.message}</p>}
              </div>
              {serverError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
                  {serverError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="border-t border-sky-dark px-6 py-4 bg-sky flex justify-between items-center gap-4">
          <div>{step > 1 && <Button type="button" variant="outline-dark" size="md" onClick={goBack}><ChevronLeft className="h-4 w-4" /> Back</Button>}</div>
          <div>
            {step < 4
              ? <Button type="button" variant="primary" size="md" onClick={goNext}>Continue <ChevronRight className="h-4 w-4" /></Button>
              : <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>{isSubmitting ? "Submitting…" : "Submit Application"}</Button>}
          </div>
        </div>
      </form>
    </div>
  );
}
