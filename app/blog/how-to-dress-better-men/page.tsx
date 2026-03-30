import { LegacyBlogFaq } from "../_components/legacy-blog-extras";

export default function Page() {
  return (
    <div className="min-h-screen max-w-3xl mx-auto bg-black px-6 py-12 text-white">
      <h1 className="mb-6 text-4xl font-bold">
        How to Dress Better as a Man (Simple Rules That Work)
      </h1>

      <p className="mb-6 text-gray-300">
        Dressing better is not about trends. It&apos;s about consistency.
      </p>

      <ul className="mb-8 list-disc pl-6 text-gray-300">
        <li>Wear fitted clothes</li>
        <li>Stick to neutral colors</li>
        <li>Upgrade footwear</li>
        <li>Dress for the occasion</li>
      </ul>

      <div className="rounded-xl bg-orange-500 p-6 text-center text-black">
        <h2 className="mb-2 text-xl font-semibold">Want a personalized plan?</h2>
        <a href="/assessment" className="font-bold underline">
          Get Your StyleScore -&gt;
        </a>
      </div>

      <LegacyBlogFaq />
    </div>
  );
}
