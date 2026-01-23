import { notFound } from "next/navigation"
import { tiptapDocToHtml } from "@/lib/tiptapToHtml"

export default function ItemPage({ item }) {
    if (!item) notFound()

    const bodyHtml = tiptapDocToHtml(item.tiptap)

    return (
        <main className="mx-auto max-w-4xl px-6 py-10">
            <header>
                <h1 className="text-3xl font-semibold">{item.title || item.slug}</h1>

                {item.shortDescription ? (
                    <p className="mt-3 text-muted-foreground">{item.shortDescription}</p>
                ) : null}

                <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
                    {item.startDate ? <span>Started: {item.startDate}</span> : null}

                    {Array.isArray(item.languages) && item.languages.length ? (
                        <span>• Languages: {item.languages.join(", ")}</span>
                    ) : null}

                    {Array.isArray(item.frameworks) && item.frameworks.length ? (
                        <span>• Frameworks: {item.frameworks.join(", ")}</span>
                    ) : null}
                </div>
            </header>

            <article
                className="prose mt-8 max-w-none"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
        </main>
    )
}
