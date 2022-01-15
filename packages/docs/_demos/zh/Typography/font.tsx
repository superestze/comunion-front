import { defineComponent } from 'vue'
import { StyleProvider } from '@comunion/components'

const DemoFontPage = defineComponent({
  name: 'DemoFontPage',
  setup() {
    return () => (
      <StyleProvider>
        <table>
          <thead>
            <tr>
              <th>Orbitron</th>
              <th>Open Sans</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <p class="font-orbitron">Comunion</p>
              </td>
              <td>
                <p class="font-opensans">Comunion</p>
              </td>
            </tr>
          </tbody>
        </table>
      </StyleProvider>
    )
  }
})

export default DemoFontPage
