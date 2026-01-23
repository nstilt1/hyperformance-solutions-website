import { generateHTML } from "@tiptap/html"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Youtube from "@tiptap/extension-youtube"

const EMPTY_DOC = { type: "doc", content: [{ type: "paragraph" }] }

export function tiptapDocToHtml(doc) {
    const safeDoc = doc && typeof doc === "object" ? doc : EMPTY_DOC

    return generateHTML(safeDoc, [
        StarterKit,
        Image,
        Link,
        Youtube,
    ])
}