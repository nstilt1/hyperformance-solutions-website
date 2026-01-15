"use client"

import { useEffect } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Youtube from "@tiptap/extension-youtube"

export default function TiptapEditor({ value, onChange }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON())
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-2 outline-none prose max-w-none",
      },
    },
  })

  // If parent swaps the doc (switching entries), update the editor content.
  useEffect(() => {
    if (!editor) return
    const next = JSON.stringify(value || {})
    const cur = JSON.stringify(editor.getJSON() || {})
    if (next !== cur) {
      editor.commands.setContent(value || { type: "doc", content: [{ type: "paragraph" }] }, false)
    }
  }, [editor, value])

  if (!editor) return null
  return <EditorContent editor={editor} />
}