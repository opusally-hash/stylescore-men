export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">
        Casual Outfits for Men That Look Effortless
      </h1>

      <ul className="list-disc pl-6 text-gray-300 mb-8">
        <li>T-shirt + chinos + sneakers</li>
        <li>Shirt + jeans + loafers</li>
        <li>Hoodie + fitted pants</li>
      </ul>

      <div className="bg-orange-500 text-black p-6 rounded-xl text-center">
        <h2 className="text-xl font-semibold mb-2">
          Are your outfits intentional?
        </h2>
        <a href="/assessment" className="underline font-bold">
          Check Now →
        </a>
      </div>
    </div>
  );
}