import { LegacyBlogTopCta } from "../_components/legacy-blog-extras";

export default function Page() {
  return (
    <div className="min-h-screen max-w-3xl mx-auto bg-black px-6 py-12 text-white">
      <h1 className="mb-6 text-4xl font-bold">10 Style Mistakes Most Men Make</h1>

      <LegacyBlogTopCta />

      <ul className="mb-8 list-disc space-y-3 pl-6 text-gray-300">
        <li>Wearing oversized clothes</li>
        <li>Ignoring shoes</li>
        <li>Using old worn-out clothes</li>
        <li>No grooming routine</li>
        <li>Mismatch of colors</li>
        <li>Too many logos</li>
        <li>Wrong fit for body type</li>
        <li>Not dressing for occasion</li>
        <li>Overusing athleisure</li>
        <li>Ignoring basics</li>
      </ul>

      <div className="rounded-xl bg-orange-500 p-6 text-center text-black">
        <h2 className="mb-2 text-xl font-semibold">
          Want to know your biggest mistake?
        </h2>
        <a href="/assessment" className="font-bold underline">
          Get Your StyleScore -&gt;
        </a>
      </div>
    </div>
  );
}
