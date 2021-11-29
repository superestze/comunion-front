import { ref, defineComponent, defineAsyncComponent, Suspense } from 'vue'
import Code from './Code'
import IconCode from './icons/IconCode'
import IconCodeSandBox from './icons/IconCodeSandBox'
import IconCopy from './icons/IconCopy'
// import 'prismjs/components/prism-tsx'
import './index.css'

// @ts-ignore
const DemoPagesMap = import.meta.glob('../../../_demos/**/*.tsx')

const Demo = defineComponent({
  name: 'Demo',
  props: {
    title: {
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
    const DocPage = defineAsyncComponent(
      DemoPagesMap[`../../../_demos/${props.src.replace(/^\//, '')}.tsx`]
    )

    const codeVisible = ref(false)

    const toggleCodeVisible = () => {
      codeVisible.value = !codeVisible.value
    }

    return () => (
      <div class="__demo">
        <div class="__demo-preview">
          <DocPage />
          {props.errorMsg && <div class="__demo-error">{props.errorMsg}</div>}
        </div>
        <article class="__demo-desc">
          <h5 class="__demo-title">{props.title}</h5>
          <p class="__demo-markdown">{ctx.slots.default?.()}</p>
        </article>
        <div class="__demo-actions">
          <IconCodeSandBox />
          <IconCopy code={props.code} class="__demo-copy" />
          <IconCode onClick={toggleCodeVisible} />
        </div>
        {codeVisible.value && (
          <Code code={props.code} />
        )}
      </div>
    )
  }
})

export default Demo
