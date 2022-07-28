import { UButton } from '@comunion/components'
import { defineComponent } from 'vue'

import animate from './animate.module.css'
import logo from '@/assets/logo.png'
import { joinComunion } from '@/utils'

export default defineComponent({
  render() {
    return (
      <div class="flex justify-between">
        <div class="w-136px <sm:w-119px flex items-center ml-40px">
          <img src={logo} class="w-full" />
        </div>
        <div class="flex h-60px text-[#B3B3B3] w-514px justify-between items-center text-16px">
          <span class={animate['undefined-underline-reveal']}>Home</span>
          <span class={animate['undefined-underline-reveal']}>GCP-NTFs</span>
          <span class={animate['undefined-underline-reveal']}>Enterprise</span>
          <span class={animate['undefined-underline-reveal']}>Dapps</span>
          <span class={animate['undefined-underline-reveal']}>API</span>
        </div>
        <div class="flex items-center">
          <UButton strong round type="primary" size="small" class="mr-40px" onClick={joinComunion}>
            Connect Account
          </UButton>
        </div>
      </div>
    )
  }
})
