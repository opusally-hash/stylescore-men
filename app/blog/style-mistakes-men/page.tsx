export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">
        10 Style Mistakes Most Men Make
      </h1>

      <ul className="list-disc pl-6 text-gray-300 space-y-3 mb-8">
        <li>Wearing oversized clothes</li>
        <li>Ignoring shoes</li>
        <li>Using old worn-out clothes</li>
        <li>No grooming routine</li>
        <li>Mismatch of colors</li>
        <li>Too many logos</li>
        <li>Wrong fit for body type</li>
        <li>Not dressing for occasion</li>
        <li>Overusing athleisure</li>
        <li>Ignoring basics</li>
      </ul>

      <div className="bg-orange-500 text-black p-6 rounded-xl text-center">
        <h2 className="text-xl font-semibold mb-2">
          Want to know your biggest mistake?
        </h2>
        <a href="/assessment" className="underline font-bold">
          Get Your StyleScore →
        </a>
      </div>
    </div>
  );
}