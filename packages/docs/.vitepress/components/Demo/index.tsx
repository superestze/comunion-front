import { defineComponent, defineAsyncComponent, Suspense } from 'vue'

// @ts-ignore
const DemoPagesMap = import.meta.glob('../../../_demos/**/*.tsx')

const Demo = defineComponent({
  name: 'Demo',
  props: {
    title: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      required: true
    },
    code: {
      type: String
    },
    src: {
      type: String,
      required: true
    },
    errorMsg: {
      type: String
    }
  },
  setup(props, ctx) {
    const DocPage = defineAsyncComponent(DemoPagesMap[`../../../_demos/${props.src.replace(/^\//, '')}.tsx`])
    return () => (
      <div class="demo">
        <h2>{props.title}</h2>
        <p>{props.desc}</p>
        <pre>
          <code class="language-tsx">{props.code}</code>
        </pre>
        {props.code && <DocPage /> }
        {props.errorMsg && <div class="error">{props.errorMsg}</div>}
      </div>
    )
  }
})

export default Demo
