import { LegacyBlogFaq } from "../_components/legacy-blog-extras";

export default function Page() {
  return (
    <div className="min-h-screen max-w-3xl mx-auto bg-black px-6 py-12 text-white">
      <h1 className="mb-6 text-4xl font-bold">
        Casual Outfits for Men That Look Effortless
      </h1>

      <ul className="mb-8 list-disc pl-6 text-gray-300">
        <li>T-shirt + chinos + sneakers</li>
        <li>Shirt + jeans + loafers</li>
        <li>Hoodie + fitted pants</li>
      </ul>

      <div className="rounded-xl bg-orange-500 p-6 text-center text-black">
        <h2 className="mb-2 text-xl font-semibold">Are your outfits intentional?</h2>
        <a href="/assessment" className="font-bold underline">
          Check Now -&gt;
        </a>
      </div>

      <LegacyBlogFaq />
    </div>
  );
}
