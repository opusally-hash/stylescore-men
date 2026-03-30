import { LegacyBlogFaq } from "../_components/legacy-blog-extras";

export default function Page() {
  return (
    <div className="min-h-screen max-w-3xl mx-auto bg-black px-6 py-12 text-white">
      <h1 className="mb-6 text-4xl font-bold">Best Clothes for Muscular Men</h1>

      <ul className="mb-8 list-disc pl-6 text-gray-300">
        <li>Wear athletic fit shirts</li>
        <li>Avoid oversized clothes</li>
        <li>Use structured fabrics</li>
      </ul>

      <div className="rounded-xl bg-orange-500 p-6 text-center text-black">
        <h2 className="mb-2 text-xl font-semibold">
          Are your clothes hiding your physique?
        </h2>
        <a href="/assessment" className="font-bold underline">
          Find Out -&gt;
        </a>
      </div>

      <LegacyBlogFaq />
    </div>
  );
}
