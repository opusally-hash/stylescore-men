export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">
        Men&apos;s Grooming Basics (Most Ignored Style Upgrade)
      </h1>

      <p className="text-gray-300 mb-6">
        You can wear great clothes and still look average if grooming is ignored.
      </p>

      <ul className="list-disc pl-6 text-gray-300 mb-8">
        <li>Trim or maintain beard regularly</li>
        <li>Use a simple skincare routine</li>
        <li>Keep nails clean</li>
        <li>Use a mild fragrance</li>
      </ul>

      <div className="bg-orange-500 text-black p-6 rounded-xl text-center">
        <h2 className="text-xl font-semibold mb-2">
          How strong is your grooming score?
        </h2>
        <a href="/assessment" className="underline font-bold">
          Take StyleScore →
        </a>
      </div>
    </div>
  );
}
