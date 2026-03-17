export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">
        Essential Wardrobe Items Every Man Should Own
      </h1>

      <ul className="list-disc pl-6 text-gray-300 mb-8">
        <li>White Oxford shirt</li>
        <li>Dark jeans</li>
        <li>Chinos</li>
        <li>White sneakers</li>
        <li>Leather shoes</li>
      </ul>

      <div className="bg-orange-500 text-black p-6 rounded-xl text-center">
        <h2 className="text-xl font-semibold mb-2">
          How complete is your wardrobe?
        </h2>
        <a href="/assessment" className="underline font-bold">
          Take StyleScore →
        </a>
      </div>
    </div>
  );
}