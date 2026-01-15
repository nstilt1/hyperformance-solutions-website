import { notFound } from "next/navigation";

export default function ItemDetailPage({ item }) {
  if (!item) return notFound();

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-semibold">{item.title}</h1>

      {item.heroImageUrl && (
        <img
          src={item.heroImageUrl}
          alt={item.title}
          className="mt-6 w-full rounded-xl border"
        />
      )}

      {item.bodyHtml && (
        <article
          className="prose mt-8 max-w-none"
          dangerouslySetInnerHTML={{ __html: item.bodyHtml }}
        />
      )}
    </div>
  );
}