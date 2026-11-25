"use client"

// MIRRORED FILE: copy lives in the dashboard branch (see AGENTS.md).

import HeroKaleido from "@/components/featured/HeroKaleido"
import FeaturedLink from "@/components/featured/FeaturedLink"

/** Full-bleed animated hero. `hero` is featured_data.json `hero`. */
export default function FeaturedHero({ hero, trackLoading = true }) {
  return (
    <section className="relative isolate flex min-h-[560px] w-full items-center overflow-hidden bg-black md:min-h-[680px]">
      <div className="absolute inset-0 -z-10">
        <HeroKaleido animation={hero.animation} trackLoading={trackLoading} />
        {/* Mobile: darken top-to-bottom so centered text reads. Desktop: darken the left column. */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-black/80 md:bg-gradient-to-r md:from-black/80 md:via-black/45 md:to-black/10" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl px-6 py-20 md:grid-cols-2 md:px-8">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <h1 className="max-w-3xl text-balance text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {hero.title}
          </h1>
          {hero.subtitle ? (
            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-200 md:text-xl">{hero.subtitle}</p>
          ) : null}
          {hero.buttons.length > 0 ? (
            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
              {hero.buttons.map((b, i) => (
                <FeaturedLink key={`${b.href}-${i}`} href={b.href} variant={b.variant}>
                  {b.label}
                </FeaturedLink>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
