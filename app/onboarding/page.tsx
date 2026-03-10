"use client";

import { useEffect, useState } from "react";

type OnboardingForm = {
  ageRange: string;
  climate: string;
  workStyle: string;
  budget: string;
  stylePreference: string;
  build: string;
  goals: string[];
  constraints: string[];
  fitChallenges: string[];
};

const multiSelectFields = {
  goals: [
    "Promotion",
    "Dating",
    "Confidence",
    "Minimalist",
    "Better everyday style",
  ],
  constraints: [
    "No leather",
    "Traditional/cultural wear",
    "Low maintenance only",
    "Budget-sensitive",
  ],
  fitChallenges: [
    "Broad shoulders",
    "Belly/tummy area",
    "Big thighs",
    "Short legs",
    "Long torso",
    "Clothes feel tight in chest/arms",
  ],
};

const defaultForm: OnboardingForm = {
  ageRange: "",
  climate: "",
  workStyle: "",
  budget: "",
  stylePreference: "",
  build: "",
  goals: [],
  constraints: [],
  fitChallenges: [],
};

function glassCard(extra = "") {
  return `rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)] ${extra}`;
}

export default function OnboardingPage() {
  const [form, setForm] = useState<OnboardingForm>(defaultForm);

  useEffect(() => {
    const saved = localStorage.getItem("stylescore_onboarding");
    if (saved) {
      setForm(JSON.parse(saved));
    }
  }, []);

  const toggleValue = (
    field: "goals" | "constraints" | "fitChallenges",
    value: string
  ) => {
    setForm((prev) => {
      const exists = prev[field].includes(value);

      const updated = {
        ...prev,
        [field]: exists
          ? prev[field].filter((item: string) => item !== value)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("stylescore_onboarding", JSON.stringify(form));
    window.location.href = "/assessment";
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#1f2937,_#0f172a_40%,_#020617_100%)] px-4 py-10 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-[-80px] h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-1/3 right-[-100px] h-80 w-80 rounded-full bg-slate-300/10 blur-3xl" />
        <div className="absolute bottom-[-100px] left-1/3 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/50">
            Personal Style Intelligence
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Set the context for your style score.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-white/70">
            A few quick answers will help personalize your style diagnosis,
            recommendations, and upgrade path.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={glassCard("p-6")}>
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/45">
                Basic Profile
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Your style context
              </h2>
              <p className="mt-2 text-white/65">
                These details help shape your score and recommendations.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Age range"
                value={form.ageRange}
                onChange={(value) => updateField("ageRange", value)}
                options={["18–24", "25–34", "35–44", "45–54", "55+"]}
              />

              <SelectField
                label="Climate"
                value={form.climate}
                onChange={(value) => updateField("climate", value)}
                options={[
                  "Hot/Humid",
                  "Warm",
                  "Mixed",
                  "Cold",
                  "Mostly indoor/controlled",
                ]}
              />

              <SelectField
                label="Work style"
                value={form.workStyle}
                onChange={(value) => updateField("workStyle", value)}
                options={[
                  "Corporate",
                  "Ops/Warehouse",
                  "Sales/Client-facing",
                  "Student",
                  "Remote/Casual",
                ]}
              />

              <SelectField
                label="Budget"
                value={form.budget}
                onChange={(value) => updateField("budget", value)}
                options={["Low", "Medium", "High"]}
              />

              <SelectField
                label="Style preference"
                value={form.stylePreference}
                onChange={(value) => updateField("stylePreference", value)}
                options={[
                  "Classic",
                  "Smart casual",
                  "Streetwear",
                  "Athleisure",
                  "Minimalist",
                ]}
              />

              <SelectField
                label="Build"
                value={form.build}
                onChange={(value) => updateField("build", value)}
                options={[
                  "Slim",
                  "Average",
                  "Athletic",
                  "Stocky",
                  "Plus",
                  "Prefer not to say",
                ]}
              />
            </div>
          </div>

          <div className={glassCard("p-6")}>
            <CheckboxGroup
              label="Goals"
              subtitle="Select all that apply."
              options={multiSelectFields.goals}
              selected={form.goals}
              onToggle={(value) => toggleValue("goals", value)}
            />
          </div>

          <div className={glassCard("p-6")}>
            <CheckboxGroup
              label="Constraints"
              subtitle="Select any constraints we should consider."
              options={multiSelectFields.constraints}
              selected={form.constraints}
              onToggle={(value) => toggleValue("constraints", value)}
            />
          </div>

          <div className={glassCard("p-6")}>
            <CheckboxGroup
              label="Fit challenges"
              subtitle="Select any fit issues you commonly face."
              options={multiSelectFields.fitChallenges}
              selected={form.fitChallenges}
              onToggle={(value) => toggleValue("fitChallenges", value)}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              className="rounded-2xl bg-white px-6 py-3 font-medium text-black transition hover:bg-white/90"
            >
              Continue to Assessment
            </button>

            <a
              href="/"
              className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-center font-medium text-white transition hover:bg-white/10"
            >
              Back
            </a>
          </div>
        </form>
      </div>
    </main>
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
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/30"
      >
        <option value="" className="text-black">
          Select
        </option>
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
      <h2 className="text-2xl font-semibold text-white">{label}</h2>
      {subtitle && <p className="mt-2 text-sm text-white/65">{subtitle}</p>}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const active = selected.includes(option);

          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={`rounded-2xl border px-4 py-4 text-left transition ${
                active
                  ? "border-white bg-white text-black shadow-lg"
                  : "border-white/10 bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </section>
  );
}