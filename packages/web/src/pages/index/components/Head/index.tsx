import closeMenu from '@/assets/close-menu.png'
import logo from '@/assets/logo.png'
import openMenu from '@/assets/open-menu.png'
import { defineComponent, reactive } from 'vue'
import { RouterLink } from 'vue-router'

let top = 0
export default defineComponent({
  name: 'Head',
  setup() {
    const state = reactive({ showMenu: false, showHead: true })

    window.addEventListener(
      'scroll',
      () => {
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        const scroll = scrollTop - top
        top = scrollTop
        if (scroll < 0) {
          state.showHead = true
        } else {
          state.showHead = false
        }
      },
      true
    )

    return () => (
      <div>
        <div
          class={`fixed left-0 top-0 z-99 w-full bg-white transition-all duration-300 ${
            !state.showHead && '-top-66px'
          }`}
        >
          <div class="m-auto <sm:h-66px h-60px w-1110px <sm:w-full h-full flex justify-between items-center <sm:pl-32px <sm:pr-33px">
            <div class="flex items-center h-full">
              {/* logo */}
              <img src={logo} class="w-136px <sm:w-119px" />
              <a
                class="text-[#333333] text-16px text-bold ml-54px  hover:text-primary <sm:hidden"
                href="https://wiki.comunion.io/comunion-economics"
                target="_blank"
              >
                Economics
              </a>
              <a
                class="text-[#333333] text-16px text-bold ml-30px hover:text-primary <sm:hidden"
                href="/"
              >
                Foundation
              </a>
            </div>
            {/* menu-icon */}
            <img
              src={openMenu}
              class="w-13px h-11px sm:hidden"
              onClick={() => (state.showMenu = true)}
            />
            <div class="flex items-center <sm:hidden">
              <a
                class="w-146px h-32px rounded-4px bg-primary text-white leading-32px text-14px text-bold mr-32px text-center"
                href="https://dev.comunion.io/b/guide"
                target="_blank"
              >
                + New Startup
              </a>
              <a
                class="w-146px h-32px rounded-4px border-1 border-primary text-primary leading-32px text-14px text-bold text-center"
                href="https://dev.comunion.io/b/guide"
                target="_blank"
              >
                Connect account
              </a>
            </div>
          </div>
        </div>

        {/* h5 menu */}
        <div
          class={`fixed w-screen h-screen bg-white z-100 top-0 transition-all sm:hidden ${
            state.showMenu ? 'left-0' : 'left-1/1'
          }`}
        >
          <div class="w-1/1 h-60px flex items-center justify-end pr-32px mb-18px">
            {/* close-icon */}
            <img src={closeMenu} class="w-12px" onClick={() => (state.showMenu = false)} />
          </div>
          <div class="m-auto w-311px leading-24px text-bold text-16px text-[#333333]">
            <RouterLink to="/" class="block mb-30px">
              Economics
            </RouterLink>
            <RouterLink to="/" class="block mb-30px">
              Foundation
            </RouterLink>
            <div class="flex items-center justify-between">
              <button class="w-128px h-48px rounded-6px bg-primary text-white leading-48px text-13px text-bold">
                + New Startup
              </button>
              <button class="w-128px h-48px rounded-6px border-1 border-primary text-primary leading-48px text-13px text-bold">
                Connect account
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
})
