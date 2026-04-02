const faqItems = [
  {
    question: "Is this men's style test free?",
    answer: "Yes, the StyleScore test is free and takes about 2 minutes.",
  },
  {
    question: "How accurate is the StyleScore?",
    answer:
      "It scores the fundamentals that matter most, including fit, grooming, footwear, and overall coordination.",
  },
  {
    question: "Can I improve my style quickly?",
    answer:
      "Yes. Most men see the fastest improvement by fixing fit, shoes, and grooming first.",
  },
  {
    question: "Do I need expensive clothes to look good?",
    answer:
      "No. Looking sharp is much more about fit, condition, and coordination than price.",
  },
];

export function LegacyBlogTopCta() {
  return (
    <div className="mb-8 rounded-2xl border border-orange-400/25 bg-white/5 p-5">
      <p className="text-white/70">Want to know how you actually score in style?</p>
      <a
        href="/onboarding"
        className="mt-4 inline-block rounded-xl bg-orange-400 px-5 py-3 font-semibold text-black transition hover:bg-orange-300"
      >
        Take the Free StyleScore -&gt;
      </a>
    </div>
  );
}

export function LegacyBlogFaq() {
  return (
    <section className="mt-16">
      <h2 className="mb-6 text-2xl font-semibold">Frequently Asked Questions</h2>

      <div className="space-y-6 text-white/70">
        {faqItems.map((item) => (
          <div key={item.question}>
            <h3 className="font-semibold text-white">{item.question}</h3>
            <p className="mt-1">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
