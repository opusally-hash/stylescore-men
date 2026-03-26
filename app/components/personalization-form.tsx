"use client";

import { useState } from "react";
import {
  defaultOnboardingForm,
  mergeOnboardingData,
  multiSelectFields,
  type OnboardingForm,
  selectFieldOptions,
} from "../lib/onboarding";

type PersonalizationFormProps = {
  title: string;
  description: string;
  submitLabel: string;
  showSkip?: boolean;
  skipLabel?: string;
  onSaved?: (form: OnboardingForm) => void;
  onSkip?: () => void;
};

function glassCard(extra = "") {
  return `rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] ${extra}`;
}

export function PersonalizationForm({
  title,
  description,
  submitLabel,
  showSkip = false,
  skipLabel = "Skip for now",
  onSaved,
  onSkip,
}: PersonalizationFormProps) {
  const [form, setForm] = useState<OnboardingForm>(() => {
    if (typeof window === "undefined") {
      return defaultOnboardingForm;
    }

    const saved = window.localStorage.getItem("stylescore_onboarding");
    return saved ? mergeOnboardingData(JSON.parse(saved)) : defaultOnboardingForm;
  });

  const toggleValue = (
    field: "goals" | "constraints" | "fitChallenges",
    value: string
  ) => {
    setForm((prev) => {
      const exists = prev[field].includes(value);
      const updated = {
        ...prev,
        [field]: exists
          ? prev[field].filter((item) => item !== value)
          : [...prev[field], value],
      };

      localStorage.setItem("stylescore_onboarding", JSON.stringify(updated));
      return updated;
    });
  };

  const updateField = (
    field: keyof Omit<OnboardingForm, "goals" | "constraints" | "fitChallenges">,
    value: string
  ) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      localStorage.setItem("stylescore_onboarding", JSON.stringify(updated));
      return updated;
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    localStorage.setItem("stylescore_onboarding", JSON.stringify(form));
    onSaved?.(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className={glassCard("p-6")}>
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/45">
            Optional Personalization
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
          <p className="mt-2 text-white/65">{description}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Age range"
            value={form.ageRange}
            onChange={(value) => updateField("ageRange", value)}
            options={[...selectFieldOptions.ageRange]}
          />

          <SelectField
            label="Climate"
            value={form.climate}
            onChange={(value) => updateField("climate", value)}
            options={[...selectFieldOptions.climate]}
          />

          <SelectField
            label="Work style"
            value={form.workStyle}
            onChange={(value) => updateField("workStyle", value)}
            options={[...selectFieldOptions.workStyle]}
          />

          <SelectField
            label="Budget"
            value={form.budget}
            onChange={(value) => updateField("budget", value)}
            options={[...selectFieldOptions.budget]}
          />

          <SelectField
            label="Style preference"
            value={form.stylePreference}
            onChange={(value) => updateField("stylePreference", value)}
            options={[...selectFieldOptions.stylePreference]}
          />

          <SelectField
            label="Build"
            value={form.build}
            onChange={(value) => updateField("build", value)}
            options={[...selectFieldOptions.build]}
          />
        </div>
      </div>

      <div className={glassCard("p-6")}>
        <div className="space-y-7">
          <CheckboxGroup
            label="Goals"
            subtitle="Select all that apply."
            options={[...multiSelectFields.goals]}
            selected={form.goals}
            onToggle={(value) => toggleValue("goals", value)}
          />

          <CheckboxGroup
            label="Constraints"
            subtitle="Select any constraints we should consider."
            options={[...multiSelectFields.constraints]}
            selected={form.constraints}
            onToggle={(value) => toggleValue("constraints", value)}
          />

          <CheckboxGroup
            label="Fit challenges"
            subtitle="Select any fit issues you commonly face."
            options={[...multiSelectFields.fitChallenges]}
            selected={form.fitChallenges}
            onToggle={(value) => toggleValue("fitChallenges", value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          className="rounded-2xl bg-white px-6 py-3 font-medium text-black transition hover:bg-white/90"
        >
          {submitLabel}
        </button>

        {showSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-center font-medium text-white transition hover:bg-white/10"
          >
            {skipLabel}
          </button>
        )}
      </div>
    </form>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-white/75">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/30"
      >
        {options.map((option) => (
          <option key={option} value={option} className="text-black">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function CheckboxGroup({
  label,
  subtitle,
  options,
  selected,
  onToggle,
}: {
  label: string;
  subtitle?: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-white">{label}</h2>
      {subtitle && <p className="mt-1 text-sm text-white/65">{subtitle}</p>}

      <div className="mt-4 space-y-2.5">
        {options.map((option) => {
          const active = selected.includes(option);

          return (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-3 rounded-xl px-1 py-1 text-sm text-white/80 transition hover:bg-white/5"
            >
              <input
                type="checkbox"
                checked={active}
                onChange={() => onToggle(option)}
                className="h-4 w-4 shrink-0 rounded border-white/20 bg-transparent accent-orange-400"
              />
              <span className="truncate">{option}</span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
