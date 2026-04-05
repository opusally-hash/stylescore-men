import { getRelatedArticles } from "../_lib/related-articles";

export function BlogRelatedLinks({ slug }: { slug: string }) {
  const relatedArticles = getRelatedArticles(slug);

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/45">
        Related Reads
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-white">
        Keep going with the next most relevant article.
      </h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {relatedArticles.map((article) => (
          <a
            key={`${slug}-${article.slug}`}
            href={article.href}
            className="rounded-2xl border border-white/10 bg-black/15 p-4 transition hover:border-orange-300/40 hover:bg-black/25"
          >
            <h3 className="text-lg font-semibold text-white">{article.title}</h3>
            {article.description ? (
              <p className="mt-2 text-sm leading-6 text-white/60">
                {article.description}
              </p>
            ) : null}
          </a>
        ))}
      </div>
    </section>
  );
}
