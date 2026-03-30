import {
  LegacyBlogFaq,
  LegacyBlogTopCta,
} from "../_components/legacy-blog-extras";

export default function Page() {
  return (
    <div className="min-h-screen max-w-3xl mx-auto bg-black px-6 py-12 text-white">
      <h1 className="mb-6 text-4xl font-bold">
        Why Most Men Look Bad in Clothes (And How to Fix It)
      </h1>

      <LegacyBlogTopCta />

      <p className="mb-6 text-gray-300">
        It&apos;s not about money. It&apos;s about decisions.
      </p>

      <ul className="mb-8 list-disc pl-6 text-gray-300">
        <li>Wrong fit</li>
        <li>Poor grooming</li>
        <li>Bad shoes</li>
        <li>No coordination</li>
      </ul>

      <div className="rounded-xl bg-orange-500 p-6 text-center text-black">
        <h2 className="mb-2 text-xl font-semibold">Find your exact problem</h2>
        <a href="/assessment" className="font-bold underline">
          Get StyleScore -&gt;
        </a>
      </div>

      <LegacyBlogFaq />
    </div>
  );
}
