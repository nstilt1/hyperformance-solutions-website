import Image from "next/image"
import { notFound } from "next/navigation"
import { tiptapDocToHtml } from "@/lib/tiptapToHtml"
import {mediaURL} from "../../lib/mediaURL";
import MetadataChart from "@/components/content/MetadataChart"

function getHeroImage(item) {
    const path = item.heroImagePath || item.thumbnailPath || "";
    return mediaURL(path);
}

export default function ItemPage({ item }) {
    if (!item) notFound()

    const bodyHtml = tiptapDocToHtml(item.tiptap)
    const hero = getHeroImage(item)

    return (
        <main className="mx-auto max-w-4xl px-6 py-10">
            <header>
                <h1 className="text-3xl font-semibold">{item.title || item.slug}</h1>

                {item.shortDescription ? (
                    <p className="mt-3 text-muted-foreground">{item.shortDescription}</p>
                ) : null}
                <MetadataChart item={item} />

                <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
                    {item.startDate ? <span>Started: {item.startDate}</span> : null}

                    {Array.isArray(item.languages) && item.languages.length ? (
                        <span>• Languages: {item.languages.join(", ")}</span>
                    ) : null}

                    {Array.isArray(item.frameworks) && item.frameworks.length ? (
                        <span>• Frameworks: {item.frameworks.join(", ")}</span>
                    ) : null}
                </div>

                {/* Hero image under title + description */}
                {hero ? (
                    <div className="mt-6 overflow-hidden rounded-2xl border bg-muted">
                        <div className="relative aspect-[16/9] w-full">
                            <Image
                                src={hero}
                                alt={item.title || item.slug}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 768px"
                                priority
                            />
                        </div>
                    </div>
                ) : null}
            </header>

            <article
                className="prose mt-8 max-w-none"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
        </main>
    )
}
