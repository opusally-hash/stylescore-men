export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">
        Best Perfumes for Men (Smell Better Instantly)
      </h1>

      <p className="text-gray-300 mb-6">
        Fragrance is one of the fastest ways to improve your presence.
      </p>

      <ul className="list-disc pl-6 text-gray-300 mb-8">
        <li>Use 2–3 sprays only</li>
        <li>Apply on neck and wrists</li>
        <li>Choose fresh or woody scents</li>
      </ul>

      <div className="bg-orange-500 text-black p-6 rounded-xl text-center">
        <h2 className="text-xl font-semibold mb-2">
          Is fragrance your weak area?
        </h2>
        <a href="/assessment" className="underline font-bold">
          Find Your Score →
        </a>
      </div>
    </div>
  );
}