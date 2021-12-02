import { defineComponent, ref, onMounted } from 'vue'
import Prism from 'prismjs'

const Code = defineComponent({
  name: 'Code',
  props: {
    code: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const codeRef = ref()

    onMounted(() => {
      Prism.highlightElement(codeRef.value)
    })

    return () => (
      <pre class="__demo-code">
        <code class="language-tsx" ref={codeRef}>{props.code}</code>
      </pre>
    )
  }
})

export default Code
