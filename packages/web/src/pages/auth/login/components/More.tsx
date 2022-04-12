import { UPopupMenu } from '@comunion/components'
import {
  HelpCircleFilled,
  MessageCircleFilled,
  MoonFilled,
  MoreOutlined,
  TypeFilled
} from '@comunion/icons'
import { defineComponent, h, ref } from 'vue'

const MoreNavigationPage = defineComponent({
  name: 'MoreNavigationPage',
  setup() {
    const options = ref([
      {
        type: 'render',
        key: 'about',
        render: () => {
          return h(
            'div',
            {
              depth: 0,
              class:
                'flex flex-row w-89 h-12 items-center cursor-pointer group hover:bg-grey3 hover:rounded-lg',
              onClick: () => window.open('https://comunion.org/', '_blank')
            },
            [
              h(
                'div',
                {
                  depth: 1,
                  class:
                    'h-8 w-8 rounded-lg mr-5 flex items-center justify-center group-hover:bg-grey3 bg-grey5'
                },
                [h(<HelpCircleFilled />, { class: 'h-4 w-4' })]
              ),
              h(
                'div',
                {
                  depth: 1,
                  class: 'font-opensans font-normal font-400 font-[16px] bg-grey-1'
                },
                [h('NText', null, { default: () => 'About Comunion' })]
              )
            ]
          )
        }
      },
      {
        type: 'render',
        key: 'https://comunion.org/',
        render: () => {
          return h(
            'div',
            {
              depth: 0,
              class:
                'flex flex-row w-89 h-12 items-center cursor-pointer group hover:bg-grey3 hover:rounded-lg',
              onClick: () => window.open('https://comunion.org/', '_blank')
            },
            [
              h(
                'div',
                {
                  depth: 1,
                  class:
                    'h-8 w-8 rounded-lg mr-5 flex items-center justify-center group-hover:bg-grey3 bg-grey5'
                },
                [h(<MessageCircleFilled />, { class: 'h-4 w-4' })]
              ),
              h(
                'div',
                {
                  depth: 1,
                  class: 'font-opensans font-normal font-400 font-[16px] bg-grey-1'
                },
                [h('NText', null, { default: () => 'Community BBS' })]
              )
            ]
          )
        }
      },
      {
        type: 'render',
        key: 'language',
        render: () => {
          return h(
            'div',
            {
              depth: 0,
              class:
                'flex flex-row w-89 h-12 items-center cursor-not-allowed group hover:bg-grey3 hover:rounded-lg',
              disabled: true
            },
            [
              h(
                'div',
                {
                  depth: 1,
                  class:
                    'h-8 w-8 rounded-lg mr-5  flex items-center justify-center group-hover:bg-grey3 bg-grey5'
                },
                [h(<TypeFilled />, { class: 'h-4 w-4' })]
              ),
              h(
                'div',
                {
                  depth: 1,
                  class: 'font-opensans font-normal font-400 font-[16px] bg-grey-1'
                },
                [h('NText', null, { default: () => 'Language' })]
              )
            ]
          )
        }
      },
      {
        type: 'render',
        key: 'moon',
        render: () => {
          return h(
            'div',
            {
              depth: 0,
              class:
                'flex flex-row w-89 h-12 items-center cursor-not-allowed group hover:bg-grey3 hover:rounded-lg',
              disabled: true
            },
            [
              h(
                'div',
                {
                  depth: 1,
                  class:
                    'h-8 w-8 rounded-lg mr-5  flex items-center justify-center group-hover:bg-grey3 bg-grey5'
                },
                [h(<MoonFilled />, { class: 'h-4 w-4' })]
              ),
              h(
                'div',
                {
                  depth: 1,
                  class: 'font-opensans font-normal font-400 font-[16px] bg-grey-1'
                },
                [h('NText', null, { default: () => 'render' })]
              )
            ]
          )
        }
      }
    ])

    return () => (
      <>
        <section>
          <UPopupMenu trigger="click" options={options.value}>
            <MoreOutlined class="top-9 right-15 absolute cursor-pointer" />
          </UPopupMenu>
        </section>
      </>
    )
  }
})

export default MoreNavigationPage
