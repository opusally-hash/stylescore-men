import { Cormorant_Garamond, Manrope } from "next/font/google";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function HomePage() {
  return (
    <main
      className={`relative min-h-screen overflow-hidden bg-[#050816] text-white ${bodyFont.className}`}
    >
      <BackgroundGlow />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-10">
        <header className="flex items-center justify-between">
          <div>
           <p className="text-lg font-bold uppercase tracking-[0.28em] text-white/60 sm:text-xl">
  StyleScore for Men
</p>
          </div>

          <a
            href="/onboarding"
            className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Start Assessment
          </a>
        </header>

        <section className="flex flex-1 items-center py-14 lg:py-10">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.38em] text-white/45">
                Personal Style Intelligence
              </p>

              <h1
                className={`mt-6 text-5xl leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl ${displayFont.className}`}
              >
                Dress sharper.
                <br />
                Know what
                <span className="text-white/60"> to fix.</span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70">
                A premium men’s fashion assessment that shows your style score,
                your weakest areas, and exactly what to improve next — from fit
                and grooming to shoes, wardrobe, and occasion styling.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <a
                  href="/onboarding"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-7 py-4 text-base font-semibold text-black transition hover:bg-white/90"
                >
                  Get My Style Score
                </a>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-base font-medium text-white transition hover:bg-white/10"
                >
                  See How It Works
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Badge>20 smart questions</Badge>
                <Badge>Personalized diagnosis</Badge>
                <Badge>Shopping-ready upgrades</Badge>
              </div>

              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                <MiniStat value="6" label="core style categories" />
                <MiniStat value="3" label="top priorities revealed" />
                <MiniStat value="1" label="clear upgrade path" />
              </div>
            </div>

            <HeroVisual />
          </div>
        </section>

        <section id="how-it-works" className="pb-14 pt-2">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/45">
              How It Works
            </p>
            <h2
              className={`mt-4 text-3xl tracking-tight text-white sm:text-4xl ${displayFont.className}`}
            >
              A sharper style system in three steps
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <StepCard
              number="01"
              title="Answer the assessment"
              text="Complete a style-focused questionnaire covering fit, wardrobe foundations, color coordination, footwear, grooming, and occasion dressing."
            />
            <StepCard
              number="02"
              title="See your style profile"
              text="Get your overall score, category breakdown, radar profile, top focus areas, and confidence-based diagnosis."
            />
            <StepCard
              number="03"
              title="Upgrade the right way"
              text="Receive specific improvements, recommended needs, and direct shopping searches for the pieces that matter most."
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function BackgroundGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.16),_transparent_32%),radial-gradient(circle_at_20%_30%,_rgba(255,255,255,0.08),_transparent_28%),radial-gradient(circle_at_80%_20%,_rgba(168,85,247,0.10),_transparent_22%),linear-gradient(180deg,_#0a1023_0%,_#050816_52%,_#02040b_100%)]" />
      <div className="absolute -left-24 top-16 h-80 w-80 rounded-full bg-white/8 blur-3xl" />
      <div className="absolute right-[-6rem] top-24 h-[28rem] w-[28rem] rounded-full bg-blue-400/10 blur-3xl" />
      <div className="absolute bottom-[-8rem] left-1/3 h-72 w-72 rounded-full bg-fuchsia-400/10 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:64px_64px]" />
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="absolute -left-4 top-8 z-10 hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 backdrop-blur-xl md:block">
        Sharp fit
      </div>
      <div className="absolute right-4 top-3 z-10 hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 backdrop-blur-xl md:block">
        Better shoes
      </div>
      <div className="absolute bottom-10 left-0 z-10 hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 backdrop-blur-xl md:block">
        Cleaner grooming
      </div>

      <div className="relative rounded-[2rem] border border-white/10 bg-white/5 p-4 backdrop-blur-2xl shadow-[0_25px_90px_rgba(0,0,0,0.45)]">
        <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[1.6rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
                  Sample Style Score
                </p>
                <h3 className="mt-4 text-5xl font-bold tracking-tight text-white">
                  74
                  <span className="ml-1 text-2xl font-medium text-white/45">
                    /100
                  </span>
                </h3>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                  Confidence
                </p>
                <p className="mt-1 text-sm font-semibold">High</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <ScoreBar label="Fit & Proportion" value={78} />
              <ScoreBar label="Shoes & Footwear" value={64} />
              <ScoreBar label="Grooming" value={58} />
            </div>
          </div>

          <div className="grid gap-4">
            <FashionCard title="Footwear" subtitle="White sneakers">
              <ShoeIcon />
            </FashionCard>

            <FashionCard title="Accessories" subtitle="Tie · watch · belt">
              <TieIcon />
            </FashionCard>

            <FashionCard title="Grooming" subtitle="Sharper finish">
              <SparkIcon />
            </FashionCard>
          </div>
        </div>

        <div className="mt-4 rounded-[1.6rem] border border-white/10 bg-black/15 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
            Top Focus Areas
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <FocusChip>Fit &amp; Proportion</FocusChip>
            <FocusChip>Shoes &amp; Footwear</FocusChip>
            <FocusChip>Grooming</FocusChip>
          </div>
        </div>
      </div>
    </div>
  );
}

function FashionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-1 text-sm text-white/55">{subtitle}</p>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-white/90">
          {children}
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm">
        <span className="text-white/70">{label}</span>
        <span className="font-medium text-white">{value}</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/10">
        <div
          className="h-2.5 rounded-full bg-white"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function FocusChip({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">
      {children}
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75 backdrop-blur-xl">
      {children}
    </div>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="mt-1 text-sm text-white/55">{label}</div>
    </div>
  );
}

function StepCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-lg font-semibold">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 leading-7 text-white/70">{text}</p>
    </div>
  );
}

function ShoeIcon() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 24 24"
      fill="none"
      className="opacity-90"
    >
      <path
        d="M4 14.5c1.5 0 2.6-.1 3.6-.4 1.3-.4 2.2-1.2 2.9-2.1l1.1-1.5 2 1.8c1 .9 2.2 1.5 3.5 1.8l2.3.5c.9.2 1.6 1 1.6 1.9 0 1.1-.9 2-2 2H6.2C4.4 18.5 3 17.1 3 15.3v-.8h1Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M9.4 10.7 11 8.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TieIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      className="opacity-90"
    >
      <path
        d="M9 3h6l-2.3 3.1L15 9l-3 12-3-12 2.3-2.9L9 3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      className="opacity-90"
    >
      <path
        d="m12 3 1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4L12 3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="m18.5 15 .7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}