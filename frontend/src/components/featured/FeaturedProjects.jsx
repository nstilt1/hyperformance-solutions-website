// MIRRORED FILE: copy lives in the dashboard branch (see AGENTS.md).

import FeaturedLink from "@/components/featured/FeaturedLink"
import { isHiddenSourceImage, parseIframeCss, safeEmbedUrl, youtubeEmbedUrl } from "@/lib/featured"

const CDN = process.env.NEXT_PUBLIC_CDN_URL || "https://cdn.hyperformancesolutions.com"

/** Same convention as the CMS: relative media paths resolve under `<cdn>/media/`. */
export function featuredImageUrl(path) {
  if (!path || isHiddenSourceImage(path)) return null
  if (/^https?:\/\//.test(path)) return path
  const clean = path.replace(/^\/+/, "").replace(/^media\//, "")
  return `${CDN.replace(/\/+$/, "")}/media/${clean}`
}

function EmbedPlaceholder({ children }) {
  return (
    <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-zinc-100 p-4 text-center text-sm text-zinc-500">
      {children}
    </div>
  )
}

/** One side of a featured row. Exported for the dashboard editor preview. */
export function FeaturedSide({ side, isFirst }) {
  if (side.type === "video") {
    const src = youtubeEmbedUrl(side.url)
    if (!src) return <EmbedPlaceholder>Add a YouTube link</EmbedPlaceholder>
    return (
      <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-sm ring-1 ring-black/5">
        <iframe
          src={src}
          title={side.title || "YouTube video"}
          loading="lazy"
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    )
  }
  if (side.type === "iframe") {
    const src = safeEmbedUrl(side.url)
    if (!src) return <EmbedPlaceholder>Add an https:// URL to embed</EmbedPlaceholder>
    const fixed = side.aspect === "auto"
    const { style, keyframesCss } = parseIframeCss(side.customCss)
    return (
      <div
        className="w-full"
        style={fixed ? { height: side.height } : { aspectRatio: side.aspect }}
      >
        <iframe
          src={src}
          title={side.title || "Embedded content"}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          // Default look first; the admin's custom CSS overrides it.
          className="h-full w-full rounded-2xl border-0 shadow-sm ring-1 ring-black/5"
          style={style}
        />
        {/* Rebuilt from validated declarations only (see parseIframeCss). */}
        {keyframesCss ? <style>{keyframesCss}</style> : null}
      </div>
    )
  }
  if (side.type === "image") {
    const src = featuredImageUrl(side.imagePath)
    if (!src) {
      return <div className="aspect-[4/3] w-full rounded-2xl bg-zinc-100" aria-hidden="true" />
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={side.imageAlt || ""}
        loading="lazy"
        className="w-full rounded-2xl object-cover shadow-sm ring-1 ring-black/5"
      />
    )
  }
  const Heading = isFirst ? "h2" : "h3"
  return (
    <div>
      {side.title ? (
        <Heading className="text-balance text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
          {side.title}
        </Heading>
      ) : null}
      {side.subtext ? (
        <p className="mt-4 max-w-xl whitespace-pre-line text-base leading-7 text-zinc-600 md:text-lg">
          {side.subtext}
        </p>
      ) : null}
    </div>
  )
}

function FeaturedRow({ project }) {
  const rightFirstMobile = project.mobileOrder === "right-first"
  // Put the button under the text side; if both/neither are text, under the row.
  const textSide =
    project.left.type === "text" ? "left" : project.right.type === "text" ? "right" : null
  const button = project.button ? (
    <div className="mt-6">
      <FeaturedLink href={project.button.href} variant="dark">
        {project.button.label}
      </FeaturedLink>
    </div>
  ) : null

  return (
    <section className="px-6 py-14 md:py-20">
      {project.dividerAbove ? <hr className="mx-auto mb-14 max-w-6xl border-zinc-200 md:mb-20" /> : null}
      <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2 md:gap-12">
        {/* Mobile stacks the sides (order chosen per project); desktop is always left | right. */}
        <div className={`min-w-0 ${rightFirstMobile ? "order-3" : "order-1"} md:order-1`}>
          <FeaturedSide side={project.left} isFirst />
          {textSide === "left" ? button : null}
        </div>
        {project.dividerBetween ? <hr className="order-2 border-zinc-200 md:hidden" /> : null}
        <div
          className={[
            "min-w-0",
            rightFirstMobile ? "order-1" : "order-3",
            "md:order-2",
            project.dividerBetween ? "md:self-stretch md:flex md:flex-col md:justify-center md:border-l md:border-zinc-200 md:pl-12" : "",
          ].join(" ")}
        >
          <FeaturedSide side={project.right} isFirst={project.left.type !== "text"} />
          {textSide === "right" ? button : null}
        </div>
      </div>
      {textSide === null && button ? <div className="mx-auto max-w-6xl text-center">{button}</div> : null}
      {project.dividerBelow ? <hr className="mx-auto mt-14 max-w-6xl border-zinc-200 md:mt-20" /> : null}
    </section>
  )
}

/** Featured project rows. `projects` is featured_data.json `projects`. */
export default function FeaturedProjects({ projects }) {
  if (!projects?.length) return null
  return (
    <div className="bg-white">
      {projects.map((p) => (
        <FeaturedRow key={p.id} project={p} />
      ))}
    </div>
  )
}
