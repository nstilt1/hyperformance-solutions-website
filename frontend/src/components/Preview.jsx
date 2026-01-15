import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"

export function Preview({ value }) {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: value,
    editable: false,
  })

  return (
    <div className="prose max-w-none">
      <EditorContent editor={editor} />
    </div>
  )
}