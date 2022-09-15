import { message, UButton } from '@comunion/components'
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
        headerClass.value = 'transform translate-y-1200px w-full bg-[#ededf2]'
      } else {
        headerClass.value = 'sticky top-0px bg-[#ededf2] z-1'
      }
    }
    onMounted(() => {
      scrollFn()
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
    const mobileJoinComunion = () => {
      message.info('Please connect your account using pc ')
    }
    return (
      <>
        <div class={`${this.headerClass} flex justify-between <md:hidden`}>
          <div class="flex ml-40px w-136px items-center <sm:w-119px">
            <img src={logo} class="w-full" />
          </div>
          <div class="flex h-60px text-primary1 text-16px gap-x-12 justify-between items-center">
            <span class="cursor-pointer text-primary hover:text-primary">Home</span>
            <span class="text-grey4">ComerID</span>
            <span class="text-grey4">Governance</span>
            <span class="text-grey4">Combinator</span>
            <span class="text-grey4">Grants</span>
            <span class="text-grey4">dAppstore</span>
            <span class="text-grey4">Developer</span>
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
        <div class="h-24.25 w-full pt-8.4 pr-9.5 pl-14 relative justify-between overflow-hidden items-center md:hidden <md:flex">
          <div class="flex items-center">
            <img
              src={colurfulLogo}
              srcset={`${colurfulLogo}, ${colurfulLogo2} 2x, ${colurfulLogo3} 3x`}
              alt="logo"
              class="h-9 w-9"
            />
            <p class="font-bold text-primary ml-1 text-[1.75rem]">COMUNION</p>
          </div>
          <div class="h-5.5 w-6.5" onClick={triggerMenu}>
            <img src={openMenu} />
          </div>
          {this.show && (
            <div class="bg-white top-0 right-0 bottom-0 left-0 z-999 fixed">
              <div class="flex justify-end">
                <div class="h-6 mt-9 mr-16 text-[#0C0C0C] w-6" onClick={triggerMenu}>
                  <img src={closeMenu} alt="close" class="w-full" />
                </div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0 }} class="font-bold mt-9 ml-16 text-4xl">
                <li class="flex mx- h-12 mb-15 auto text-grey1 w-155.5 items-center">Home</li>
                <li class="flex mx- h-12 mb-15 auto text-[#B3B3B3] w-155.5 items-center">
                  ComerID
                </li>
                <li class="flex mx- h-12 mb-15 auto text-[#B3B3B3] w-155.5 items-center">
                  Governance
                </li>
                <li class="flex mx- h-12 mb-15 auto text-[#B3B3B3] w-155.5 items-center">
                  Combinator
                </li>
                <li class="flex mx- h-12 mb-15 auto text-[#B3B3B3] w-155.5 items-center">Grants</li>
                <li class="flex mx- h-12 mb-15 auto text-[#B3B3B3] w-155.5 items-center">
                  dAppstore
                </li>
                <li class="flex mx- h-12 mb-15 auto text-[#B3B3B3] w-155.5 items-center">
                  Developer
                </li>
              </ul>
              <div class="flex w-full items-center justify-center">
                <UButton type="primary" class="h-24 w-155.5" onClick={mobileJoinComunion}>
                  <span class="font-bold text-3xl">Connect Account</span>
                </UButton>
              </div>
            </div>
          )}
        </div>
      </>
    )
  }
})
