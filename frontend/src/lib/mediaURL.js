// Returns the URL of media, or null if the path is empty.
export function mediaURL(path) {
    if (!path || typeof path !== "string" || !path.trim()) {
        return null
    }
    return `https://cdn.hyperformancesolutions.com/media/${path}`;
}