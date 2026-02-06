// Returns the URL of media, or null if the path is empty.
import {getSiteUrl} from "./siteUrl";

export function mediaURL(path) {
    if (!path || typeof path !== "string" || !path.trim()) {
        return null
    }
    if (path.startsWith("/")) {
        path = path.substring(1);
    }
    let siteUrl = getSiteUrl();
    let cdn = "";
    if (siteUrl.includes("www")) {
        cdn = siteUrl.replace("www", "cdn");
    } else if (siteUrl.includes("//")) {
        cdn = siteUrl.replace("//", "//cdn.");
    }
    return `${cdn}/media/${path}`;
}