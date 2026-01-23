import Link from "next/link"
import { Card } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table"

function isNonEmptyString(v) {
    return typeof v === "string" && v.trim().length > 0
}

function toStringArray(v) {
    if (!v) return []
    if (Array.isArray(v)) return v.filter(isNonEmptyString)
    if (isNonEmptyString(v)) return [v.trim()]
    return []
}

function normalizeGitHubRepo(repo) {
    // Accept:
    // - "owner/repo"
    // - "https://github.com/owner/repo"
    // Return { label, href } or null
    if (!isNonEmptyString(repo)) return null
    const r = repo.trim()

    if (r.startsWith("http://") || r.startsWith("https://")) {
        return { label: r.replace(/^https?:\/\/(www\.)?/, ""), href: r }
    }

    // Basic owner/repo shorthand
    if (/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(r)) {
        return { label: `github.com/${r}`, href: `https://github.com/${r}` }
    }

    return { label: r, href: r } // last resort
}

function ExternalLink({ href, children }) {
    // Use <a> for external to avoid prefetch behavior; keep it simple.
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:opacity-80"
        >
            {children}
        </a>
    )
}

/**
 * Spec-driven rows:
 * label: left side label
 * getValue(item): returns either string or string[]
 * render(values): optional custom renderer
 */
const DEFAULT_FIELDS = [
    {
        key: "dateStarted",
        label: "Start date",
        getValue: (item) => item.startDate
    },
    {
        key: "languages",
        label: "Language(s)",
        getValue: (item) => toStringArray(item.languages),
        render: (values) => values.join(", "),
    },
    {
        key: "githubRepos",
        label: "GitHub Repo(s)",
        getValue: (item) => toStringArray(item.gitRepos),
        render: (values) => (
            <div className="flex flex-col gap-1">
                {values
                    .map(normalizeGitHubRepo)
                    .filter(Boolean)
                    .map((r) => (
                        <ExternalLink key={r.href} href={r.href}>
                            {r.label}
                        </ExternalLink>
                    ))}
            </div>
        ),
    },
    {
        key: "frameworks",
        label: "Framework(s)",
        getValue: (item) => toStringArray(item.frameworks),
        render: (values) => values.join(", "),
    },
    {
        key: "url",
        label: "URL",
        getValue: (item) => (isNonEmptyString(item.url) ? [item.url.trim()] : []),
        render: (values) => (
            <ExternalLink href={values[0]}>{values[0]}</ExternalLink>
        ),
    },
    {
        key: "tags",
        label: "Tag(s)",
        getValue: (item) => toStringArray(item.tags),
        render: (values) => (
            <div className="flex flex-wrap gap-2">
                {values.map((t) => (
                    <Link
                        key={t}
                        href={`/portfolio?tag=${encodeURIComponent(t)}`}
                        className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted/40"
                    >
                        {t}
                    </Link>
                ))}
            </div>
        ),
    },
]

export default function MetadataChart({ item, fields = DEFAULT_FIELDS, title = "At a glance" }) {
    // Build only rows with values
    const rows = (fields || [])
        .map((f) => {
            const raw = f.getValue ? f.getValue(item) : []
            const values = toStringArray(raw)
            return { ...f, values }
        })
        .filter((f) => f.values.length > 0)

    if (rows.length === 0) return null

    return (
        <Card className="mt-6 p-4">
            <div className="text-sm font-medium">{title}</div>
            <div className="mt-3">
                <Table>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.key}>
                                <TableCell className="w-[160px] align-top font-medium">
                                    {row.label}
                                </TableCell>
                                <TableCell className="align-top">
                                    {row.render ? row.render(row.values, item) : row.values.join(", ")}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Card>
    )
}
