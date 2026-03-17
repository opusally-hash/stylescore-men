export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">
        Take the Ultimate Men's Style Test (Free)
      </h1>

      <p className="text-gray-300 mb-6">
        Most men think they dress well — until they actually measure it.
        Your style is not about expensive clothes. It's about fit, coordination,
        grooming, and consistency.
      </p>

      <div className="bg-orange-500 text-black p-6 rounded-xl text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          Get Your StyleScore in 2 Minutes
        </h2>
        <a href="/assessment" className="underline font-bold">
          Take the Style Test →
        </a>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Why Most Men Get Style Wrong</h2>
      <p className="text-gray-300 mb-6">
        Most men focus only on clothes. But style is a combination of:
      </p>

      <ul className="list-disc pl-6 text-gray-300 mb-6">
        <li>Fit and proportions</li>
        <li>Color coordination</li>
        <li>Shoes and grooming</li>
        <li>Understanding occasions</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4">What is a Good Style Score?</h2>
      <p className="text-gray-300 mb-6">
        Based on our data:
        <br />• 50–60 = Average
        <br />• 60–75 = Good
        <br />• 75+ = Highly stylish
      </p>

      <div className="bg-orange-500 text-black p-6 rounded-xl text-center mt-10">
        <h2 className="text-xl font-semibold mb-2">
          Find Your Score Now
        </h2>
        <a href="/assessment" className="underline font-bold">
          Take the StyleScore Test →
        </a>
      </div>
    </div>
  );
}
