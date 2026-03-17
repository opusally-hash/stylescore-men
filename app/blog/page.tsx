const articles = [
  {
    title: "Take the Ultimate Men's Style Test",
    description: "Discover your style score and how to improve it.",
    href: "/blog/mens-style-test",
  },
  {
    title: "10 Style Mistakes Most Men Make",
    description: "Avoid these common fashion mistakes instantly.",
    href: "/blog/style-mistakes-men",
  },
  {
    title: "How to Improve Your Style in 30 Days",
    description: "A practical guide to upgrading your appearance.",
    href: "/blog/how-to-improve-style",
  },
  {
    title: "Best White Sneakers for Men",
    description: "One of the easiest upgrades for a cleaner, sharper look.",
    href: "/blog/best-white-sneakers-men",
  },
  {
    title: "Men's Grooming Basics",
    description: "The most ignored style upgrade for men.",
    href: "/blog/mens-grooming-basics",
  },
  {
    title: "How to Dress Better as a Man",
    description: "Simple rules that instantly improve appearance.",
    href: "/blog/how-to-dress-better-men",
  },
  {
    title: "Best Perfumes for Men",
    description: "Smell better and improve presence instantly.",
    href: "/blog/best-perfume-for-men",
  },
  {
    title: "Essential Wardrobe Items Every Man Should Own",
    description: "Build a stronger wardrobe foundation.",
    href: "/blog/mens-wardrobe-essentials",
  },
  {
    title: "Fashion Tips for Short Men",
    description: "Look taller instantly with smarter style choices.",
    href: "/blog/fashion-for-short-men",
  },
  {
    title: "Best Clothes for Muscular Men",
    description: "Stop hiding your physique with the wrong clothes.",
    href: "/blog/fashion-for-muscular-men",
  },
  {
    title: "Why Most Men Look Bad in Clothes",
    description: "The biggest reasons men look sloppy — and how to fix them.",
    href: "/blog/why-men-look-bad-in-clothes",
  },
  {
    title: "Casual Outfits for Men That Look Effortless",
    description: "Easy outfit formulas that still look intentional.",
    href: "/blog/casual-outfits-men",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-3 text-4xl font-bold">StyleScore Blog</h1>
        <p className="mb-8 text-white/65">
          Practical men’s style guides, wardrobe upgrades, grooming basics, and
          style improvement articles.
        </p>

        <div className="space-y-5">
          {articles.map((article) => (
            <a
              key={article.href}
              href={article.href}
              className="block rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
            >
              <h2 className="text-2xl font-semibold">{article.title}</h2>
              <p className="mt-2 text-sm text-white/65">
                {article.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}