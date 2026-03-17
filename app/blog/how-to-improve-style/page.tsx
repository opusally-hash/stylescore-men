export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">
        How to Improve Your Style in 30 Days
      </h1>

      <p className="text-gray-300 mb-6">
        Improving your style is not about buying everything new.
        It's about fixing the highest-impact areas first.
      </p>

      <ul className="list-disc pl-6 text-gray-300 mb-8">
        <li>Fix your fit first</li>
        <li>Upgrade your shoes</li>
        <li>Improve grooming</li>
        <li>Build a basic wardrobe</li>
      </ul>

      <div className="bg-orange-500 text-black p-6 rounded-xl text-center">
        <h2 className="text-xl font-semibold mb-2">
          Get Your Personalized Plan
        </h2>
        <a href="/assessment" className="underline font-bold">
          Take StyleScore →
        </a>
      </div>
    </div>
  );
}