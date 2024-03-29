import { defineComponent } from 'vue'
import { getParameters } from 'codesandbox/lib/api/define'

const IconCodeSandBox = defineComponent({
  name: 'IconCodeSandBox',
  props: {
    code: {
      type: String,
      required: true
    },
    title: {
      type: String
    }
  },
  setup(props) {
    const toCodeSandBox = () => {
      const parameters = getParameters({
        files: {
          'package.json': {
            content: {
              dependencies: {
                vue: 'latest',
                '@comunion/components': 'latest'
              }
            }
          },
          'index.tsx': {
            content: `${props.code}`,
            isBinary: false
          }
        }
      })
      const div = document.createElement('div')
      div.innerHTML = `
      <form action="https://codesandbox.io/api/v1/sandboxes/define" method="POST" target="_blank">
        <input type="hidden" name="parameters" value="${parameters}" />
      </form>
      `
      document.body.appendChild(div)
      ;(div.children[0] as HTMLFormElement).submit()
    }
    return () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16.2"
        height="18"
        viewBox="0 0 256 296"
        onClick={toCodeSandBox}
      >
        <title>View on codesandbox</title>
        <path
          d="M115.498 261.088v-106.61L23.814 101.73v60.773l41.996 24.347v45.7l49.688 28.54zm23.814.627l50.605-29.151V185.78l42.269-24.495v-60.011l-92.874 53.621v106.82zm80.66-180.887l-48.817-28.289l-42.863 24.872l-43.188-24.897l-49.252 28.667l91.914 52.882l92.206-53.235zM0 222.212V74.495L127.987 0L256 74.182v147.797l-128.016 73.744L0 222.212z"
          fill="currentColor"
        />
      </svg>
    )
  }
})

export default IconCodeSandBox
