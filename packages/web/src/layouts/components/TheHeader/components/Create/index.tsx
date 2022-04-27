import { UButton, UDropdown } from '@comunion/components'
import { PlusOutlined } from '@comunion/icons'
import { defineComponent } from 'vue'
import CreateStartupBlock from '@/blocks/Startup/Create'

const CreateBlock = defineComponent({
  name: 'CreateBlock',
  setup(props, ctx) {
    return () => (
      <UDropdown
        trigger="click"
        width={343}
        themeOverrides={{
          optionHeightMedium: '58px'
        }}
        options={[
          {
            type: 'group',
            label: 'Create',
            key: 'label',
            children: [
              {
                key: 'startup',
                label: () => (
                  <CreateStartupBlock>
                    <div class="flex p-3 items-center">
                      <div>
                        <div class="text-primary2 u-title2">Startup</div>
                        <div class="mt-1 text-grey4 u-body2">
                          Create your Startup, initial your dream
                        </div>
                      </div>
                    </div>
                  </CreateStartupBlock>
                )
              }
            ]
          }
        ]}
      >
        <UButton class={['rounded-lg text-primary px-5', ctx.attrs.class]} type="primary" ghost>
          <PlusOutlined class="h-4 mr-3 w-4" />
          <span class="text-primary u-label1">CREATE</span>
        </UButton>
      </UDropdown>
    )
  }
})

export default CreateBlock
