export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">
        How to Dress Better as a Man (Simple Rules That Work)
      </h1>

      <p className="text-gray-300 mb-6">
        Dressing better is not about trends. It’s about consistency.
      </p>

      <ul className="list-disc pl-6 text-gray-300 mb-8">
        <li>Wear fitted clothes</li>
        <li>Stick to neutral colors</li>
        <li>Upgrade footwear</li>
        <li>Dress for the occasion</li>
      </ul>

      <div className="bg-orange-500 text-black p-6 rounded-xl text-center">
        <h2 className="text-xl font-semibold mb-2">
          Want a personalized plan?
        </h2>
        <a href="/assessment" className="underline font-bold">
          Get Your StyleScore →
        </a>
      </div>
    </div>
  );
}
