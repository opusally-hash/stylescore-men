export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-16 max-w-3xl mx-auto">

      <h1 className="text-4xl font-bold mb-6">
        Take the Ultimate Men's Style Test (Free)
      </h1>

      <p className="text-white/70 mb-6">
        Most men think they dress well — until they actually measure it.
        Style is not about expensive clothes. It’s about fit, coordination,
        grooming, and consistency.
      </p>

      {/* CTA */}
      <div className="bg-orange-400 text-black rounded-xl p-6 text-center mb-10">
        <p className="font-semibold text-lg mb-2">
          Get Your StyleScore in 2 Minutes
        </p>
        <a href="/onboarding" className="underline font-medium">
          Take the Style Test →
        </a>
      </div>

      <h2 className="text-2xl font-semibold mt-10 mb-4">
        What is a Men's Style Test?
      </h2>

      <p className="text-white/70 mb-6">
        A men’s style test evaluates how well you dress based on key factors
        like clothing fit, color coordination, grooming, footwear, and
        overall presentation. Instead of guessing your style, it gives you a
        measurable score and tells you exactly what to improve.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4">
        Why Most Men Get Style Wrong
      </h2>

      <ul className="list-disc ml-6 text-white/70 mb-6">
        <li>They focus only on clothes, not grooming</li>
        <li>Poor fitting outfits</li>
        <li>Ignoring shoes completely</li>
        <li>No understanding of color combinations</li>
        <li>Dressing randomly without consistency</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4">
        What Your StyleScore Measures
      </h2>

      <p className="text-white/70 mb-4">
        Your StyleScore is calculated across multiple categories:
      </p>

      <ul className="list-disc ml-6 text-white/70 mb-6">
        <li>Fit & Proportion</li>
        <li>Clothing Selection</li>
        <li>Shoes</li>
        <li>Grooming</li>
        <li>Fragrance</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4">
        What is a Good Style Score?
      </h2>

      <p className="text-white/70 mb-6">
        A score above 80% indicates strong style awareness. Between 60–80%
        means you’re doing okay but need improvement. Below 60% suggests major
        gaps in fit, grooming, or coordination.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-4">
        How to Improve Your Style Fast
      </h2>

      <ul className="list-disc ml-6 text-white/70 mb-6">
        <li>Wear better-fitting clothes</li>
        <li>Upgrade your shoes</li>
        <li>Fix your grooming routine</li>
        <li>Stick to neutral colors</li>
        <li>Dress based on occasion</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-4">
        Why StyleScore is Different
      </h2>

      <p className="text-white/70 mb-6">
        Unlike generic fashion advice, StyleScore gives you a personalized
        breakdown of your strengths and weaknesses. It tells you exactly what
        to focus on first so you improve faster.
      </p>

      {/* Bottom CTA */}
      <div className="bg-orange-400 text-black rounded-xl p-6 text-center mt-10">
        <p className="font-semibold text-lg mb-2">
          Find Your StyleScore Now
        </p>
        <a href="/onboarding" className="underline font-medium">
          Start Free Test →
        </a>
      </div>

    </div>
  );
}