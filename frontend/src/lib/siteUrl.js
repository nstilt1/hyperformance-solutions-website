export function getSiteUrl() {
    const url =
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.SITE_URL ||
        "http://localhost:3000"

    return url.endsWith("/") ? url.slice(0, -1) : url
}