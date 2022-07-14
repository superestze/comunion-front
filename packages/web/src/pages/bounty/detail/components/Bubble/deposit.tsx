import { defineComponent } from 'vue'
import Bubble from './core'

export default defineComponent({
  render() {
    return (
      <Bubble
        v-slots={{
          default: (obj: any) => (
            <div class="flex justify-between flex-grow">
              <div class="flex flex-col ml-5">
                <p class="mb-2 u-title1">{obj.name}</p>
                <p class="text-14px text-grey3">{obj.time}</p>
              </div>
              <div class="text-warning text-14px u-h3 flex items-center">+{obj.money} UVU</div>
              {/* <div class="text-success text-14px u-h3">+{obj.money} USDC</div> */}
            </div>
          )
        }}
      />
    )
  }
})
