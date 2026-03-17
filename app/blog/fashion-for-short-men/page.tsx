export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">
        Fashion Tips for Short Men (Look Taller Instantly)
      </h1>

      <ul className="list-disc pl-6 text-gray-300 mb-8">
        <li>Wear fitted clothes</li>
        <li>Avoid long tops</li>
        <li>Use vertical patterns</li>
        <li>Match shoe and pant color</li>
      </ul>

      <div className="bg-orange-500 text-black p-6 rounded-xl text-center">
        <h2 className="text-xl font-semibold mb-2">
          Does your fit reduce your height?
        </h2>
        <a href="/assessment" className="underline font-bold">
          Check Your Score →
        </a>
      </div>
    </div>
  );
}