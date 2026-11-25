"use client"

// CMS editor for featured_data.json: homepage hero (text, buttons, animation
// settings) and the featured project list. Edits are passed up via onChange
// and saved with the rest of the content through update_content.

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import FeaturedHero from "@/components/featured/FeaturedHero"
import {
  ANIMATION_FNS,
  DEFAULT_ANIMATION,
  DEFAULT_HERO,
  PI,
  isHiddenSourceImage,
  newFeaturedProject,
} from "@/lib/featured"

const label = "text-xs text-muted-foreground"
const select = "h-9 w-full rounded-md border bg-background px-2 text-sm"

function Field({ title, hint, children }) {
  return (
    <div>
      <label className={label}>{title}</label>
      {children}
      {hint ? <div className="mt-1 text-[11px] text-muted-foreground">{hint}</div> : null}
    </div>
  )
}

function NumberSlider({ title, value, onChange, min, max, step, format, hint }) {
  return (
    <Field title={<span className="flex justify-between"><span>{title}</span><span>{format(value)}</span></span>} hint={hint}>
      <div className="flex items-center gap-2">
        <input type="range" className="flex-1" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))} />
        <Input type="number" className="w-24" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))} />
      </div>
    </Field>
  )
}

function FnSelect({ value, onChange }) {
  return (
    <select className={select} value={value} onChange={(e) => onChange(e.target.value)}>
      {ANIMATION_FNS.map((f) => <option key={f} value={f}>{f}</option>)}
    </select>
  )
}

const piLabel = (k) => (k > 0 ? `${k}π ≈ ${(k * PI).toFixed(2)}s` : "Off")

function ButtonRow({ button, onChange, onRemove, withVariant = true }) {
  return (
    <div className="grid grid-cols-12 gap-2">
      <Input className="col-span-4" placeholder="Button text" value={button.label}
        onChange={(e) => onChange({ ...button, label: e.target.value })} />
      <Input className={withVariant ? "col-span-4" : "col-span-6"} placeholder="/contact or https://…" value={button.href}
        onChange={(e) => onChange({ ...button, href: e.target.value })} />
      {withVariant ? (
        <select className={`${select} col-span-2`} value={button.variant}
          onChange={(e) => onChange({ ...button, variant: e.target.value })}>
          <option value="primary">Solid</option>
          <option value="secondary">Outline</option>
        </select>
      ) : null}
      <Button variant="outline" className="col-span-2" onClick={onRemove}>Remove</Button>
    </div>
  )
}

function SideEditor({ title, side, onChange }) {
  const imageBlocked = side.type === "image" && isHiddenSourceImage(side.imagePath)
  return (
    <div className="space-y-2 rounded-md border p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        <select className={`${select} w-32`} value={side.type}
          onChange={(e) => onChange(e.target.value === "image"
            ? { type: "image", imagePath: "", imageAlt: "" }
            : { type: "text", title: "", subtext: "" })}>
          <option value="text">Text</option>
          <option value="image">Image</option>
        </select>
      </div>
      {side.type === "image" ? (
        <>
          <Input placeholder="images/my-project.png" value={side.imagePath || ""}
            onChange={(e) => onChange({ ...side, imagePath: e.target.value })} />
          {imageBlocked ? (
            <div className="text-[11px] text-red-600">That is the animation&apos;s source image, which is never shown. Pick another image.</div>
          ) : (
            <div className="text-[11px] text-muted-foreground">Relative to the CDN&apos;s /media/ folder, or a full URL.</div>
          )}
          <Input placeholder="Alt text" value={side.imageAlt || ""}
            onChange={(e) => onChange({ ...side, imageAlt: e.target.value })} />
        </>
      ) : (
        <>
          <Input placeholder="Title" value={side.title || ""}
            onChange={(e) => onChange({ ...side, title: e.target.value })} />
          <Textarea rows={3} placeholder="Subtext (optional; leave empty for title only)" value={side.subtext || ""}
            onChange={(e) => onChange({ ...side, subtext: e.target.value })} />
        </>
      )}
    </div>
  )
}

function Check({ checked, onChange, children }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {children}
    </label>
  )
}

export default function FeaturedEditor({ value, onChange }) {
  const hero = value.hero
  const anim = hero.animation
  const setHero = (patch) => onChange({ ...value, hero: { ...hero, ...patch } })
  const setAnim = (patch) => setHero({ animation: { ...anim, ...patch } })
  const setRecolor = (patch) => setAnim({ recolor: { ...anim.recolor, ...patch } })
  const setProjects = (projects) => onChange({ ...value, projects })
  const setProject = (i, patch) =>
    setProjects(value.projects.map((p, j) => (j === i ? { ...p, ...patch } : p)))
  const moveProject = (i, d) => {
    const next = [...value.projects]
    const j = i + d
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    setProjects(next)
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Settings */}
      <div className="col-span-12 space-y-6 xl:col-span-5">
        <section className="space-y-3 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Hero text</h2>
            <Button variant="ghost" size="sm" onClick={() => setHero({ title: DEFAULT_HERO.title, subtitle: DEFAULT_HERO.subtitle, buttons: DEFAULT_HERO.buttons })}>
              Reset text
            </Button>
          </div>
          <Field title="Title">
            <Input value={hero.title} onChange={(e) => setHero({ title: e.target.value })} />
          </Field>
          <Field title="Subtext">
            <Textarea rows={2} value={hero.subtitle} onChange={(e) => setHero({ subtitle: e.target.value })} />
          </Field>
          <div className="space-y-2">
            <div className={label}>Buttons</div>
            {hero.buttons.map((b, i) => (
              <ButtonRow key={i} button={b}
                onChange={(nb) => setHero({ buttons: hero.buttons.map((x, j) => (j === i ? nb : x)) })}
                onRemove={() => setHero({ buttons: hero.buttons.filter((_, j) => j !== i) })} />
            ))}
            <Button variant="outline" size="sm"
              onClick={() => setHero({ buttons: [...hero.buttons, { label: "", href: "/", variant: "secondary" }] })}>
              Add button
            </Button>
          </div>
        </section>

        <section className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Animation</h2>
            <Button variant="ghost" size="sm" onClick={() => setHero({ animation: DEFAULT_ANIMATION })}>Reset animation</Button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            The base cycle is whole seconds and the other speeds are multiples of π, so their ratio is
            irrational and the animation never repeats.
          </p>
          <NumberSlider title="Base cycle (zoom + rotation)" value={anim.baseDurationSeconds} min={5} max={600} step={1}
            format={(v) => `${v}s`} onChange={(v) => setAnim({ baseDurationSeconds: Math.round(v) })} />
          <NumberSlider title="Reorientation period" value={anim.reorientationPi} min={0} max={320} step={0.5}
            format={piLabel} hint="Multiple of π seconds. 0 turns it off."
            onChange={(v) => setAnim({ reorientationPi: v })} />
          <Field title="Reorientation function"><FnSelect value={anim.reorientationFn} onChange={(v) => setAnim({ reorientationFn: v })} /></Field>
          <NumberSlider title="Radius period" value={anim.radiusPi} min={0} max={320} step={0.5}
            format={piLabel} hint="Multiple of π seconds. 0 turns it off."
            onChange={(v) => setAnim({ radiusPi: v })} />
          <NumberSlider title="Radius depth" value={anim.radiusDepth} min={0} max={1} step={0.01}
            format={(v) => `${Math.round(v * 100)}%`} onChange={(v) => setAnim({ radiusDepth: v })} />
          <Field title="Radius function"><FnSelect value={anim.radiusFn} onChange={(v) => setAnim({ radiusFn: v })} /></Field>
          <NumberSlider title="Hue shift" value={anim.hueShift} min={0} max={359} step={1}
            format={(v) => `${v}°`} onChange={(v) => setAnim({ hueShift: Math.round(v) })} />
          <NumberSlider title="Start offset" value={anim.timeOffsetSeconds} min={0} max={2000} step={1}
            format={(v) => `${v}s`}
            hint="Fast-forwards zoom, rotation and reorientation so the animation starts somewhere different from the Altered Brain Chemistry site. Radius always starts at 0."
            onChange={(v) => setAnim({ timeOffsetSeconds: v })} />

          <Separator />
          <Check checked={anim.recolor.enabled} onChange={(v) => setRecolor({ enabled: v })}>Recolor</Check>
          {anim.recolor.enabled ? (
            <div className="grid grid-cols-2 gap-3">
              <Field title="Seed"><Input value={anim.recolor.seed} onChange={(e) => setRecolor({ seed: e.target.value })} /></Field>
              <Field title="Mode"><Input type="number" min={0} max={8} value={anim.recolor.mode} onChange={(e) => setRecolor({ mode: Number(e.target.value) })} /></Field>
              <Field title="Threshold"><Input type="number" min={0} max={1} step={0.01} value={anim.recolor.threshold} onChange={(e) => setRecolor({ threshold: Number(e.target.value) })} /></Field>
              <Field title="Cell size"><Input type="number" min={4} max={512} value={anim.recolor.cellSize} onChange={(e) => setRecolor({ cellSize: Number(e.target.value) })} /></Field>
            </div>
          ) : null}
        </section>
      </div>

      {/* Live hero preview */}
      <div className="col-span-12 xl:col-span-7">
        <div className="sticky top-4 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Hero preview</h2>
            <a href="/admin/preview" target="_blank" rel="noreferrer" className="text-sm underline">
              Open full homepage preview ↗
            </a>
          </div>
          <div className="overflow-hidden rounded-lg border">
            <FeaturedHero hero={hero} trackLoading={false} />
          </div>
          <p className="text-[11px] text-muted-foreground">Needs WebGPU; otherwise a looping video stands in.</p>
        </div>
      </div>

      {/* Featured projects */}
      <section className="col-span-12 space-y-4 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Featured projects ({value.projects.length})</h2>
          <Button onClick={() => setProjects([...value.projects, newFeaturedProject()])}>Add featured project</Button>
        </div>
        {value.projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">None yet. They show under the hero on the homepage.</p>
        ) : null}
        {value.projects.map((p, i) => (
          <div key={p.id} className="space-y-3 rounded-md border bg-muted/20 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-medium">#{i + 1}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => moveProject(i, -1)} disabled={i === 0}>↑</Button>
                <Button variant="outline" size="sm" onClick={() => moveProject(i, 1)} disabled={i === value.projects.length - 1}>↓</Button>
                <Button variant="destructive" size="sm" onClick={() => setProjects(value.projects.filter((_, j) => j !== i))}>Delete</Button>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <SideEditor title="Left" side={p.left} onChange={(left) => setProject(i, { left })} />
              <SideEditor title="Right" side={p.right} onChange={(right) => setProject(i, { right })} />
            </div>
            <div className="flex flex-wrap gap-4">
              <Check checked={p.dividerAbove} onChange={(v) => setProject(i, { dividerAbove: v })}>Line above</Check>
              <Check checked={p.dividerBelow} onChange={(v) => setProject(i, { dividerBelow: v })}>Line below</Check>
              <Check checked={p.dividerBetween} onChange={(v) => setProject(i, { dividerBetween: v })}>Line between left and right</Check>
              <label className="flex items-center gap-2 text-sm">
                On mobile show
                <select className={`${select} w-auto`} value={p.mobileOrder} onChange={(e) => setProject(i, { mobileOrder: e.target.value })}>
                  <option value="left-first">left side first</option>
                  <option value="right-first">right side first</option>
                </select>
              </label>
            </div>
            {p.button ? (
              <ButtonRow button={p.button} withVariant={false}
                onChange={(button) => setProject(i, { button })}
                onRemove={() => setProject(i, { button: null })} />
            ) : (
              <Button variant="outline" size="sm" onClick={() => setProject(i, { button: { label: "Learn more", href: "/portfolio", variant: "primary" } })}>
                Add button
              </Button>
            )}
          </div>
        ))}
      </section>
    </div>
  )
}
