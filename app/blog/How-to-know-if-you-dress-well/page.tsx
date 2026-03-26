import { Cormorant_Garamond, Manrope } from "next/font/google";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "How to Know If You Dress Well (Without Asking Anyone) | StyleScore",
  description:
    "Wondering if you dress well? Learn 7 clear signs that instantly tell you if your style is working — no opinions needed.",
};

export default function Page() {
  return (
    <main className={`min-h-screen bg-[#050816] text-white px-6 py-12 ${bodyFont.className}`}>
      <div className="max-w-3xl mx-auto">

        <h1 className={`text-4xl mb-6 ${displayFont.className}`}>
          How to Know If You Dress Well (Without Asking Anyone)
        </h1>

        <p className="text-white/70 mb-6">
          Most men think they dress well.
        </p>

        <p className="text-white/70 mb-6">
          But the truth is — most men don’t actually know.
        </p>

        <p className="text-white/70 mb-6">
          Not because they lack effort. But because they lack clarity.
        </p>

        <p className="text-white/70 mb-10">
          Style isn’t judged by opinions. It follows patterns. Once you understand those patterns,
          you don’t need validation from anyone.
        </p>

        {/* SECTION 1 */}
        <h2 className="text-2xl font-semibold mb-4">1. Your Clothes Fit Cleanly</h2>

        <p className="text-white/70 mb-6">
          This is the biggest indicator of good style.
        </p>

        <p className="text-white/70 mb-6">
          Your t-shirt should sit clean on your shoulders. Your pants should not bunch at the ankles.
          Your shirt sleeves should end right near your wrist.
        </p>

        <p className="text-white/70 mb-10">
          If your clothes look like they were made for you — you’re already ahead of most men.
        </p>

        {/* SECTION 2 */}
        <h2 className="text-2xl font-semibold mb-4">2. Your Shoes Don’t Break the Outfit</h2>

        <p className="text-white/70 mb-6">
          Most men ignore shoes. That’s where they lose.
        </p>

        <p className="text-white/70 mb-6">
          Dirty sneakers, bulky running shoes, or worn-out footwear instantly downgrade your look —
          even if everything else is good.
        </p>

        <p className="text-white/70 mb-10">
          Clean white sneakers or simple leather shoes already fix 50% of style problems.
        </p>

        {/* SECTION 3 */}
        <h2 className="text-2xl font-semibold mb-4">3. You Look Intentional</h2>

        <p className="text-white/70 mb-6">
          Good style looks effortless — but it’s never random.
        </p>

        <p className="text-white/70 mb-6">
          If your outfit feels like you just “threw something on,” people can tell.
        </p>

        <p className="text-white/70 mb-10">
          But if your colors match, your fit is consistent, and nothing feels out of place —
          you look intentional.
        </p>

        {/* SECTION 4 */}
        <h2 className="text-2xl font-semibold mb-4">4. People React Subtly</h2>

        <p className="text-white/70 mb-6">
          Most people won’t compliment you directly.
        </p>

        <p className="text-white/70 mb-6">
          But they will:
        </p>

        <ul className="list-disc ml-6 text-white/70 mb-6">
          <li>Look twice</li>
          <li>Maintain eye contact</li>
          <li>Treat you with slightly more respect</li>
        </ul>

        <p className="text-white/70 mb-10">
          Style works quietly.
        </p>

        {/* SECTION 5 */}
        <h2 className="text-2xl font-semibold mb-4">5. Your Grooming Matches Your Outfit</h2>

        <p className="text-white/70 mb-6">
          You can’t outdress poor grooming.
        </p>

        <p className="text-white/70 mb-6">
          Hair, beard, skin — these matter more than clothes.
        </p>

        <p className="text-white/70 mb-10">
          Even a simple outfit looks premium when grooming is sharp.
        </p>

        {/* SECTION 6 */}
        <h2 className="text-2xl font-semibold mb-4">6. Nothing Feels “Off”</h2>

        <p className="text-white/70 mb-6">
          This is hard to explain — but easy to feel.
        </p>

        <p className="text-white/70 mb-6">
          When your outfit works, nothing stands out negatively.
        </p>

        <p className="text-white/70 mb-10">
          No weird colors. No awkward fits. No mismatched pieces.
        </p>

        {/* SECTION 7 */}
        <h2 className="text-2xl font-semibold mb-4">7. You Feel Confident Without Thinking</h2>

        <p className="text-white/70 mb-6">
          The final test is internal.
        </p>

        <p className="text-white/70 mb-6">
          If you’re constantly adjusting your clothes, second-guessing, or feeling uncomfortable —
          something is off.
        </p>

        <p className="text-white/70 mb-10">
          Good style removes friction. You just exist — confidently.
        </p>

        {/* CTA */}
        <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
          <h3 className="text-xl font-semibold mb-4">
            Want a clear answer instead of guessing?
          </h3>

          <p className="text-white/70 mb-4">
            Take the StyleScore quiz and see exactly where you stand across fit, shoes,
            grooming, and overall style.
          </p>

          <a
            href="/assessment"
            className="inline-block bg-orange-400 text-black px-5 py-3 rounded-xl font-semibold"
          >
            Check Your StyleScore →
          </a>
        </div>

      </div>
    </main>
  );
}
