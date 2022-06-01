import { defineComponent, reactive, onMounted, onUnmounted } from 'vue'
import closeMenu from '@/assets/close-menu.png'
import logo from '@/assets/logo.png'
import openMenu from '@/assets/open-menu.png'
import { joinComunion } from '@/utils'

let top = 0
export default defineComponent({
  name: 'Head',
  setup() {
    const state = reactive({ showMenu: false, showHead: true })

    const onScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      const scroll = scrollTop - top
      top = scrollTop
      if (scroll < 0) {
        state.showHead = true
      } else {
        state.showHead = false
      }
    }

    onMounted(() => {
      window.addEventListener('scroll', onScroll, true)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', onScroll, true)
      top = 0
    })

    return () => (
      <div>
        <div
          class={`fixed left-0 top-0 z-99 w-full bg-white transition-all duration-300 ${
            !state.showHead && '-top-66px'
          }`}
        >
          <div class="flex h-full m-auto h-60px w-1110px justify-between items-center <sm:h-66px <sm:w-full <sm:pr-33px <sm:pl-32px">
            <div class="flex h-full items-center">
              {/* logo */}
              <img src={logo} class="w-136px <sm:w-119px" />
              {/* <a
                class="text-bold ml-54px text-[#333333] text-16px  <sm:hidden hover:text-primary"
                href="https://wiki.comunion.io/comunion-economics"
                target="_blank"
              >
                Economics
              </a>
              <a
                class="text-bold ml-30px text-[#333333] text-16px <sm:hidden hover:text-primary"
                href="/"
              >
                Foundation
              </a> */}
            </div>
            {/* menu-icon */}
            <img
              src={openMenu}
              class="h-11px w-13px sm:hidden"
              onClick={() => (state.showMenu = true)}
            />
            <div class="flex items-center <sm:hidden">
              <div
                onClick={joinComunion}
                class="bg-primary cursor-pointer rounded-4px h-32px text-white text-bold mr-32px text-center text-14px leading-32px w-146px"
              >
                Launch App
              </div>
            </div>
          </div>
        </div>

        {/* h5 menu */}
        <div
          class={`fixed w-screen h-screen bg-white z-100 top-0 transition-all sm:hidden ${
            state.showMenu ? 'left-0' : 'left-1/1'
          }`}
        >
          <div class="flex h-60px mb-18px pr-32px w-1/1 items-center justify-end">
            {/* close-icon */}
            <img src={closeMenu} class="w-12px" onClick={() => (state.showMenu = false)} />
          </div>
          <div class="m-auto text-bold text-16px text-[#333333] leading-24px w-311px">
            <div
              onClick={joinComunion}
              class="border-primary border-1 rounded-6px h-48px text-primary text-bold text-13px leading-48px w-128px"
            >
              Connect account
            </div>
          </div>
        </div>
      </div>
    )
  }
})
