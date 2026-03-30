import { LegacyBlogFaq } from "../_components/legacy-blog-extras";

export default function Page() {
  return (
    <div className="min-h-screen max-w-3xl mx-auto bg-black px-6 py-12 text-white">
      <h1 className="mb-6 text-4xl font-bold">
        Fashion Tips for Short Men (Look Taller Instantly)
      </h1>

      <ul className="mb-8 list-disc pl-6 text-gray-300">
        <li>Wear fitted clothes</li>
        <li>Avoid long tops</li>
        <li>Use vertical patterns</li>
        <li>Match shoe and pant color</li>
      </ul>

      <div className="rounded-xl bg-orange-500 p-6 text-center text-black">
        <h2 className="mb-2 text-xl font-semibold">
          Does your fit reduce your height?
        </h2>
        <a href="/assessment" className="font-bold underline">
          Check Your Score -&gt;
        </a>
      </div>

      <LegacyBlogFaq />
    </div>
  );
}
