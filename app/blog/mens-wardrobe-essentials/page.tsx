import {
  LegacyBlogFaq,
  LegacyBlogTopCta,
} from "../_components/legacy-blog-extras";

export default function Page() {
  return (
    <div className="min-h-screen max-w-3xl mx-auto bg-black px-6 py-12 text-white">
      <h1 className="mb-6 text-4xl font-bold">
        Essential Wardrobe Items Every Man Should Own
      </h1>

      <LegacyBlogTopCta />

      <ul className="mb-8 list-disc pl-6 text-gray-300">
        <li>White Oxford shirt</li>
        <li>Dark jeans</li>
        <li>Chinos</li>
        <li>White sneakers</li>
        <li>Leather shoes</li>
      </ul>

      <div className="rounded-xl bg-orange-500 p-6 text-center text-black">
        <h2 className="mb-2 text-xl font-semibold">
          How complete is your wardrobe?
        </h2>
        <a href="/assessment" className="font-bold underline">
          Take StyleScore -&gt;
        </a>
      </div>

      <LegacyBlogFaq />
    </div>
  );
}
