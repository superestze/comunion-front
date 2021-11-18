import { defineComponent, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import closeMenu from '../../assets/close-menu.png'
import logo from '../../assets/logo.png'
import openMenu from '../../assets/open-menu.png'
import smallLogo from '../../assets/small-logo.png'

export default defineComponent({
  name: 'Head',
  setup() {
    const state = reactive({ showMenu: false })

    return () => (
      <div>
        <div class="fixed left-0 top-0 z-99 w-full bg-white ">
          <div class="m-auto <sm:h-66px h-60px w-1110px <sm:w-full h-full flex justify-between items-center <sm:pl-32px <sm:pr-33px">
            <div class="flex items-center h-full">
              {/* logo */}
              <img src={smallLogo} class="w-22px h-21px sm:hidden" />
              <img src={logo} class="w-136px <sm:hidden" />
              <a
                class="text-textColor text-16px text-bold ml-54px  hover:text-primary <sm:hidden"
                href="https://wiki.comunion.io/comunion-economics"
                target="_blank"
              >
                Economics
              </a>
              <a
                class="text-textColor text-16px text-bold ml-30px hover:text-primary <sm:hidden"
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
                + New Start-Up
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

        {/* h5菜单弹窗 */}
        <div
          class={`fixed w-screen h-screen bg-white z-100 top-0 transition-all sm:hidden ${
            state.showMenu ? 'left-0' : 'left-1/1'
          }`}
        >
          <div class="w-1/1 h-60px flex items-center justify-end pr-32px mb-18px">
            {/* close-icon */}
            <img src={closeMenu} class="w-12px" onClick={() => (state.showMenu = false)} />
          </div>
          <div class="m-auto w-311px leading-24px text-bold text-16px text-textColor">
            <RouterLink to="/" class="block mb-30px">
              Economics
            </RouterLink>
            <RouterLink to="/" class="block mb-30px">
              Foundation
            </RouterLink>
            <div class="flex items-center justify-between">
              <button class="w-128px h-48px rounded-6px bg-primary text-white leading-48px text-13px text-bold">
                + New Start-Up
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
