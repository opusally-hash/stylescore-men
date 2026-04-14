import type { Metadata } from "next";
import Link from "next/link";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { ContactSection } from "./components/contact-section";
import { TrackedHomeCta } from "./components/tracked-home-cta";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "StyleScore for Men - Men's Style Quiz and Diagnosis",
  description:
    "Take the 2-minute men's style quiz to get your StyleScore, category breakdown, diagnosis, and a clear upgrade path.",
  alternates: {
    canonical: "https://stylescore.live",
  },
  openGraph: {
    title: "StyleScore for Men - Men's Style Quiz and Diagnosis",
    description:
      "Take the 2-minute men's style quiz to get your StyleScore, category breakdown, diagnosis, and a clear upgrade path.",
    url: "https://stylescore.live",
    type: "website",
    images: [
      {
        url: "/og-image-share.png",
        width: 1368,
        height: 768,
        alt: "StyleScore for Men social preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StyleScore for Men - Men's Style Quiz and Diagnosis",
    description:
      "Take the 2-minute men's style quiz to get your StyleScore, category breakdown, diagnosis, and a clear upgrade path.",
    images: ["/og-image-share.png"],
  },
};

export default function HomePage() {
  return (
    <main
      className={`relative min-h-screen overflow-hidden bg-[#050816] text-white ${bodyFont.className}`}
    >
      <BackgroundGlow />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 lg:px-10">
        <header className="flex items-center justify-between gap-6 py-2">
          <Link
            href="/"
            className="text-lg font-bold uppercase tracking-[0.28em] text-white/60 sm:text-xl"
          >
            StyleScore for Men
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-white/65 lg:flex">
            <a href="#about" className="transition hover:text-white">
              About
            </a>
            <a href="#how-it-works" className="transition hover:text-white">
              How It Works
            </a>
            <Link href="/blog" className="transition hover:text-white">
              Blog
            </Link>
            <a href="#contact" className="transition hover:text-white">
              Contact
            </a>
          </nav>

          <TrackedHomeCta
            href="/style-quiz"
            location="hero"
            className="premium-glow rounded-2xl bg-orange-400 px-5 py-3 text-sm font-semibold text-black shadow-[0_0_24px_rgba(251,146,60,0.4)] transition hover:bg-orange-300"
          >
            Get My Style Score
          </TrackedHomeCta>
        </header>

        <section className="flex flex-1 items-center py-14 lg:py-10">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.38em] text-white/80">
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
                A premium men&apos;s style assessment that shows your score, your
                weakest areas, and exactly what to improve next - from fit and
                grooming to shoes, wardrobe, and occasion styling.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <TrackedHomeCta
                  href="/style-quiz"
                  location="hero"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-7 py-4 text-base font-semibold text-black transition hover:bg-white/90"
                >
                  Get My Style Score
                </TrackedHomeCta>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-base font-medium text-white transition hover:bg-white/10"
                >
                  See How It Works
                </a>

                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-base font-medium text-white transition hover:bg-white/10"
                >
                  Blog
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Badge>10 smart questions</Badge>
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

        <section id="about" className="pb-14 pt-2">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/45">
                About Us
              </p>
              <h2
                className={`mt-4 text-3xl tracking-tight text-white sm:text-4xl ${displayFont.className}`}
              >
                We help men see what is working in their style and what is not.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/68">
                StyleScore turns style advice into something you can actually use.
                Instead of vague opinions, we score the parts that shape how you
                look - fit, wardrobe basics, color coordination, shoes, grooming,
                and how you dress for the moment.
              </p>
              <p className="mt-4 max-w-2xl leading-8 text-white/62">
                The goal is simple: show you where your look is strong, show you
                what is dragging it down, and make the next upgrade obvious.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <AboutCard
                title="Clear diagnosis"
                text="See which category is helping your look and which one is quietly costing you points."
              />
              <AboutCard
                title="Practical next steps"
                text="Get advice you can act on right away instead of broad fashion talk that goes nowhere."
              />
              <AboutCard
                title="Built for real wardrobes"
                text="The system is meant for everyday men who want to dress sharper without rebuilding everything at once."
              />
              <AboutCard
                title="Fast enough to finish"
                text="The assessment stays short, so you get useful insight quickly and keep moving."
              />
            </div>
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
              text="Get your overall score, category breakdown, radar profile, top focus areas, and a direct diagnosis."
            />
            <StepCard
              number="03"
              title="Upgrade the right way"
              text="Receive specific improvements, recommended needs, and direct shopping searches for the pieces that matter most."
            />
          </div>
        </section>

        <section className="pb-20 pt-4">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/45">
                From the Blog
              </p>
              <h2
                className={`mt-4 text-3xl tracking-tight text-white sm:text-4xl ${displayFont.className}`}
              >
                Style advice that actually improves how you look
              </h2>
            </div>

            <Link
              href="/blog"
              className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10 sm:inline-flex"
            >
              View all articles
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Link
              href="/blog/mens-style-test"
              className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition hover:bg-white/10"
            >
              <h3 className="text-lg font-semibold text-white">
                Men&apos;s Style Test: Score Your Look in 10 Questions
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Discover your score and what to improve first.
              </p>
            </Link>

            <Link
              href="/blog/style-mistakes-men"
              className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition hover:bg-white/10"
            >
              <h3 className="text-lg font-semibold text-white">
                10 Style Mistakes Most Men Make
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/60">
                The common mistakes that quietly ruin appearance.
              </p>
            </Link>

            <Link
              href="/blog/how-to-improve-style"
              className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition hover:bg-white/10"
            >
              <h3 className="text-lg font-semibold text-white">
                How to Improve Your Style in 30 Days
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/60">
                A practical style upgrade roadmap.
              </p>
            </Link>
          </div>

          <div className="mt-6 sm:hidden">
            <Link
              href="/blog"
              className="inline-flex rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
            >
              View all articles
            </Link>
          </div>
        </section>

        <section id="contact" className="pb-20 pt-4">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/45">
                Contact
              </p>
              <h2
                className={`mt-4 text-3xl tracking-tight text-white sm:text-4xl ${displayFont.className}`}
              >
                Tell us what felt helpful, what felt broken, or what you want next.
              </h2>
            </div>

            <p className="max-w-xl leading-7 text-white/62">
              If a part of the quiz confused you, a result felt off, or you have
              an idea that would make StyleScore stronger, send it here.
            </p>
          </div>

          <ContactSection />
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

            <FashionCard title="Accessories" subtitle="Tie - watch - belt">
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

function AboutCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.22)]">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 leading-7 text-white/68">{text}</p>
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
