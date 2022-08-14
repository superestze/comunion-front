import { UButton } from '@comunion/components'
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'

import colurfulLogo from '@/assets/20220725/colorful.png'
import colurfulLogo2 from '@/assets/20220725/colorful@2x.png'
import colurfulLogo3 from '@/assets/20220725/colorful@3x.png'
import closeMenu from '@/assets/close-menu.png'
import logo from '@/assets/logo.png'
import openMenu from '@/assets/open-menu.png'

import { joinComunion } from '@/utils'

export default defineComponent({
  setup() {
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

    const show = ref<boolean>(false)
    return {
      headerClass,
      show
    }
  },
  render() {
    const triggerMenu = () => {
      this.show = !this.show
    }
    return (
      <>
        <div class={`${this.headerClass} <md:hidden`}>
          <div class="w-136px <sm:w-119px flex items-center ml-40px">
            <img src={logo} class="w-full" />
          </div>
          <div class="flex h-60px text-[#B3B3B3] w-514px justify-between items-center text-16px">
            <span>Home</span>
            <span>GCI</span>
            <span>Dapps</span>
            <span>Enterprise</span>
            <span>API</span>
          </div>
          <div class="flex items-center">
            <UButton
              strong
              round
              type="primary"
              size="small"
              class="mr-40px"
              onClick={joinComunion}
            >
              Connect Account
            </UButton>
          </div>
        </div>
        <div class="<md:flex md:hidden relative justify-between h-24.25 pl-14 pt-8.4 pr-9.5 overflow-hidden items-center w-full">
          <div class="flex items-center">
            <img
              src={colurfulLogo}
              srcset={`${colurfulLogo}, ${colurfulLogo2} 2x, ${colurfulLogo3} 3x`}
              alt="logo"
              class="w-9 h-9"
            />
            <p class="text-primary font-bold text-28px ml-1">COMUNION</p>
          </div>
          <div class="w-6.5 h-5.5" onClick={triggerMenu}>
            <img src={openMenu} />
          </div>
          {this.show && (
            <div class="fixed left-0 right-0 top-0 bottom-0 bg-white z-999">
              <div class="flex justify-end">
                <div class="w-6 h-6 text-[#0C0C0C] mr-16 mt-9" onClick={triggerMenu}>
                  <img src={closeMenu} alt="close" class="w-full" />
                </div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0 }} class=" text-32px font-bold mt-9 ml-16">
                <li class="h-12 flex items-center mb-15 w-155.5 mx- auto text-grey1">Home</li>
                <li class="h-12 flex items-center mb-15 w-155.5 mx- auto text-[#B3B3B3]">GCI</li>
                <li class="h-12 flex items-center mb-15 w-155.5 mx- auto text-[#B3B3B3]">Dapps</li>
                <li class="h-12 flex items-center mb-15 w-155.5 mx- auto text-[#B3B3B3]">
                  Enterprise
                </li>
                <li class="h-12 flex items-center mb-15 w-155.5 mx- auto text-[#B3B3B3]">API</li>
              </ul>
              <div class="flex items-center justify-center w-full">
                <UButton type="primary" class="w-155.5 h-24" onClick={joinComunion}>
                  <span class="text-30px font-bold">Connect Account</span>
                </UButton>
              </div>
            </div>
          )}
        </div>
      </>
    )
  }
})
