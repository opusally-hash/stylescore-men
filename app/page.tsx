export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#1f2937,_#0f172a_40%,_#020617_100%)] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-[-80px] h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-1/3 right-[-100px] h-80 w-80 rounded-full bg-slate-300/10 blur-3xl" />
        <div className="absolute bottom-[-100px] left-1/3 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/50">
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

        <section className="flex flex-1 items-center py-16">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/50">
                Personal Style Intelligence
              </p>

              <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Understand your style.
                <br />
                Upgrade what matters.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
                Take a premium style assessment built for men. Get your overall
                style score, category breakdown, top improvement areas,
                personalized advice, and shopping-ready upgrade suggestions.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="/onboarding"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-4 text-base font-medium text-black transition hover:bg-white/90"
                >
                  Start Assessment
                </a>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-base font-medium text-white transition hover:bg-white/10"
                >
                  See How It Works
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">
                  20-question style assessment
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">
                  Personalized style diagnosis
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">
                  Shopping-ready upgrade plan
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
              <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/50">
                  Sample Result
                </p>

                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-5xl font-bold sm:text-6xl">
                      72
                      <span className="ml-1 text-2xl font-medium text-white/45">
                        /100
                      </span>
                    </h2>
                    <p className="mt-3 text-white/70">
                      Good base, clear upgrade path
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-right">
                    <p className="text-xs uppercase tracking-[0.25em] text-white/45">
                      Confidence
                    </p>
                    <p className="mt-1 text-base font-semibold">High</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-lg font-semibold text-white">
                    Focus Top 3
                  </h3>
                  <ul className="mt-4 space-y-3 text-white/75">
                    <li className="rounded-xl border border-white/10 bg-black/10 p-3">
                      Shoes &amp; Footwear
                    </li>
                    <li className="rounded-xl border border-white/10 bg-black/10 p-3">
                      Grooming
                    </li>
                    <li className="rounded-xl border border-white/10 bg-black/10 p-3">
                      Fit &amp; Proportion
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <h3 className="text-lg font-semibold text-white">
                    Why people use it
                  </h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="text-white/70">Style clarity</span>
                        <span className="text-white">84</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-white/10">
                        <div className="h-2.5 w-[84%] rounded-full bg-white" />
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="text-white/70">Shopping guidance</span>
                        <span className="text-white">76</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-white/10">
                        <div className="h-2.5 w-[76%] rounded-full bg-white" />
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="text-white/70">Confidence upgrade</span>
                        <span className="text-white">81</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-white/10">
                        <div className="h-2.5 w-[81%] rounded-full bg-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="pb-12">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/50">
              How It Works
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              A sharper style system in three steps
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-lg font-semibold">
                01
              </div>
              <h3 className="text-xl font-semibold">Answer the assessment</h3>
              <p className="mt-3 leading-7 text-white/70">
                Complete a style-focused questionnaire covering fit, wardrobe,
                color coordination, shoes, grooming, accessories, and occasion
                dressing.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-lg font-semibold">
                02
              </div>
              <h3 className="text-xl font-semibold">See your style profile</h3>
              <p className="mt-3 leading-7 text-white/70">
                Get your overall score, category breakdown, focus top 3,
                confidence level, and visual profile to understand what is
                helping or hurting your style.
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-lg font-semibold">
                03
              </div>
              <h3 className="text-xl font-semibold">Upgrade the right way</h3>
              <p className="mt-3 leading-7 text-white/70">
                Receive practical improvements, recommended needs, and shopping
                suggestions so you can improve faster without wasting money on
                the wrong items.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}