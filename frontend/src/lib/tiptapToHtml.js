import { generateHTML } from "@tiptap/html"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Youtube from "@tiptap/extension-youtube"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { lowlight } from "lowlight"
import 'highlight.js/styles/atom-one-dark.css'

const EMPTY_DOC = { type: "doc", content: [{ type: "paragraph" }] }

export function tiptapDocToHtml(doc) {
    const safeDoc = doc && typeof doc === "object" ? doc : EMPTY_DOC

    return generateHTML(safeDoc, [
        StarterKit.configure({
            codeBlock: false, // disable built‑in code block
        }),
        CodeBlockLowlight.configure({
            lowlight,
        }),
        Image,
        Link,
        Youtube,
    ])
}