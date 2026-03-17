// app/blog/page.tsx

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">StyleScore Blog</h1>

      <div className="space-y-6">
        <a href="/blog/mens-style-test" className="block p-6 border border-gray-700 rounded-xl hover:bg-gray-900">
          <h2 className="text-xl font-semibold">Take the Ultimate Men's Style Test</h2>
          <p className="text-gray-400 text-sm mt-2">
            Discover your style score and how to improve it.
          </p>
        </a>

        <a href="/blog/style-mistakes-men" className="block p-6 border border-gray-700 rounded-xl hover:bg-gray-900">
          <h2 className="text-xl font-semibold">10 Style Mistakes Most Men Make</h2>
          <p className="text-gray-400 text-sm mt-2">
            Avoid these common fashion mistakes instantly.
          </p>
        </a>

        <a href="/blog/how-to-improve-style" className="block p-6 border border-gray-700 rounded-xl hover:bg-gray-900">
          <h2 className="text-xl font-semibold">How to Improve Your Style in 30 Days</h2>
          <p className="text-gray-400 text-sm mt-2">
            A practical guide to upgrading your appearance.
          </p>
        </a>
      </div>
    </div>
  );
}
