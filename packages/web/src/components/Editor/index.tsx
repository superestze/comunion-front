import { BoldFilled, ItalicFilled, UnderlineFilled } from '@comunion/icons'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import { useEditor, EditorContent, Editor } from '@tiptap/vue-3'
import { defineComponent, PropType, ref } from 'vue'
import './style.css'

const RichEditor = defineComponent({
  name: 'RichEditor',
  props: {
    placeholder: {
      type: String
    },
    value: {
      type: String
    }
  },
  emits: ['update:value'],
  setup(props, ctx) {
    const editor = useEditor({
      editorProps: {
        attributes: {
          class: 'py-2 px-4'
        }
      },
      content: props.value,
      onUpdate: ({ editor }) => {
        const value = editor.getHTML()

        ctx.emit('update:value', value)
      },
      extensions: [
        StarterKit,
        Underline,
        Placeholder.configure({
          placeholder: props.placeholder
        })
      ]
    })

    return () => (
      <div class="rich-editor">
        <div class="bg-purple py-1 px-4 flex items-center">
          {editor.value && <RichEditorHeader editor={editor.value} />}
        </div>
        <EditorContent editor={editor.value} />
      </div>
    )
  }
})

const RichEditorHeader = defineComponent({
  name: 'RichEditorHeader',
  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true
    }
  },
  setup(props) {
    const headers = ref([
      {
        Icon: <BoldFilled />,
        title: 'Bold',
        action: () => props.editor.chain().focus().toggleBold().run(),
        isActive: () => props.editor.isActive('bold')
      },
      {
        Icon: <ItalicFilled />,
        title: 'Italic',
        action: () => props.editor.chain().focus().toggleItalic().run(),
        isActive: () => props.editor.isActive('italic')
      },
      {
        Icon: <UnderlineFilled />,
        title: 'Underline',
        action: () => props.editor.chain().focus().toggleUnderline().run(),
        isActive: () => props.editor.isActive('strike')
      }
    ])

    return () =>
      headers.value.map(header => {
        return (
          <button
            class={[
              'rich-editor__header-item',
              { 'rich-editor__header-item-is-active': header.isActive ? header.isActive() : null }
            ]}
            onClick={header.action}
            title={header.title}
          >
            {header.Icon}
          </button>
        )
      })
  }
})

export default RichEditor