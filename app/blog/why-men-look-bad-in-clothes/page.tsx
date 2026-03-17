export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">
        Why Most Men Look Bad in Clothes (And How to Fix It)
      </h1>

      <p className="text-gray-300 mb-6">
        It’s not about money. It’s about decisions.
      </p>

      <ul className="list-disc pl-6 text-gray-300 mb-8">
        <li>Wrong fit</li>
        <li>Poor grooming</li>
        <li>Bad shoes</li>
        <li>No coordination</li>
      </ul>

      <div className="bg-orange-500 text-black p-6 rounded-xl text-center">
        <h2 className="text-xl font-semibold mb-2">
          Find your exact problem
        </h2>
        <a href="/assessment" className="underline font-bold">
          Get StyleScore →
        </a>
      </div>
    </div>
  );
}