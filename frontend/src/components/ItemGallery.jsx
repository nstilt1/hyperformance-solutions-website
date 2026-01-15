import Link from "next/link";

export default function ItemGallery({ title, basePath, items }) {
    if (!items?.length) {
        return (
            <div className="rounded-xl border p-6 text-sm text-muted-foreground">
                No items match the selected filters.
            </div>
        );
    }

  return (
    <section className="space-y-4">
      {title && (
        <h2 className="text-2xl font-semibold">
          {title}
        </h2>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`${basePath}/${item.slug}`}
            className="rounded-xl border p-4 transition hover:bg-muted/50"
          >
            <div className="space-y-1">
              <div className="text-lg font-medium">
                {item.title}
              </div>

              {item.shortDescription && (
                <div className="text-sm text-muted-foreground">
                  {item.shortDescription}
                </div>
              )}
            </div>

            {/* Optional tags / facets */}
            {Array.isArray(item.tags) && item.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {item.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-muted px-2 py-1 text-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}