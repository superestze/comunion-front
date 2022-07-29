import { UButton } from '@comunion/components'
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'

import logo from '@/assets/logo.png'
import { joinComunion } from '@/utils'

export default defineComponent({
  setup() {
    // 960 1064
    //
    const headerClass = ref<string>('flex justify-between')
    const scrollFn = () => {
      if (document.scrollingElement && document.scrollingElement.scrollTop > 1200) {
        headerClass.value = 'flex justify-between transform translate-y-1200px w-full bg-[#ededf2]'
      } else {
        headerClass.value = 'flex justify-between sticky top-0px bg-[#ededf2] z-1'
      }
    }
    onMounted(() => {
      document.addEventListener('scroll', scrollFn)
    })

    onUnmounted(() => {
      document.addEventListener('scroll', scrollFn)
    })
    return {
      headerClass
    }
  },
  render() {
    return (
      <div class={this.headerClass}>
        <div class="w-136px <sm:w-119px flex items-center ml-40px">
          <img src={logo} class="w-full" />
        </div>
        <div class="flex h-60px text-[#B3B3B3] w-514px justify-between items-center text-16px">
          <span>Home</span>
          <span>GCP-NTFs</span>
          <span>Enterprise</span>
          <span>Dapps</span>
          <span>API</span>
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
