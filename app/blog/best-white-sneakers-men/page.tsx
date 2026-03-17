export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">
        Best White Sneakers for Men (Style Upgrade Guide)
      </h1>

      <p className="text-gray-300 mb-6">
        If you upgrade only one item in your wardrobe, make it white sneakers.
        They instantly improve your look.
      </p>

      <ul className="list-disc pl-6 text-gray-300 mb-8">
        <li>Minimal design</li>
        <li>Leather preferred</li>
        <li>Keep them clean</li>
        <li>Works with everything</li>
      </ul>

      <div className="bg-orange-500 text-black p-6 rounded-xl text-center">
        <a href="/assessment" className="underline font-bold">
          Check Your StyleScore →
        </a>
      </div>
    </div>
  );
}