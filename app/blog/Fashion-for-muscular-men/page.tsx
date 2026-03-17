export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">
        Best Clothes for Muscular Men
      </h1>

      <ul className="list-disc pl-6 text-gray-300 mb-8">
        <li>Wear athletic fit shirts</li>
        <li>Avoid oversized clothes</li>
        <li>Use structured fabrics</li>
      </ul>

      <div className="bg-orange-500 text-black p-6 rounded-xl text-center">
        <h2 className="text-xl font-semibold mb-2">
          Are your clothes hiding your physique?
        </h2>
        <a href="/assessment" className="underline font-bold">
          Find Out →
        </a>
      </div>
    </div>
  );
}