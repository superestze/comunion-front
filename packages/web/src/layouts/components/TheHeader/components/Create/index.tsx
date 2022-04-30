import { UButton, UDropdown } from '@comunion/components'
import {
  PlusOutlined,
  CreateStartupFilled,
  CreateBountyFilled,
  CreateOfferingFilled
} from '@comunion/icons'
import { defineComponent, ref } from 'vue'
import styles from './index.module.css'
import CreateStartupBlock, { CreateStartupRef } from '@/blocks/Startup/Create'

const CreateBlock = defineComponent({
  name: 'CreateBlock',
  setup(props, ctx) {
    const createStartupRef = ref<CreateStartupRef>()

    const onCreateStartup = () => {
      createStartupRef.value?.show()
    }

    return () => (
      <>
        <CreateStartupBlock ref={createStartupRef} />
        <UDropdown
          trigger="click"
          width={343}
          class={styles.dropdown}
          placement="bottom-start"
          themeOverrides={{
            optionOpacityDisabled: '0.4'
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
                    <div class="flex items-center" onClick={onCreateStartup}>
                      <div class="rounded flex bg-[#f8f8f8] h-8 mr-4 w-8 items-center justify-center">
                        <CreateStartupFilled />
                      </div>
                      <div>
                        <div class="text-primary2 u-title2">Startup</div>
                        <div class="mt-1 text-grey2 u-body2">
                          Create your Startup, initial your dream
                        </div>
                      </div>
                    </div>
                  )
                },
                {
                  key: 'bounty',
                  disabled: true,
                  label: () => (
                    <div class="flex items-center">
                      <div class="rounded flex bg-[#f8f8f8] h-8 mr-4 w-8 items-center justify-center">
                        <CreateBountyFilled />
                      </div>
                      <div>
                        <div class="text-primary2 u-title2">Bounty</div>
                        <div class="mt-1 text-grey2 u-body2">
                          Post your bounty to expand your startup
                        </div>
                      </div>
                    </div>
                  )
                },
                {
                  key: 'Offering',
                  disabled: true,
                  label: () => (
                    <div class="flex items-center">
                      <div class="rounded flex bg-[#f8f8f8] h-8 mr-4 w-8 items-center justify-center">
                        <CreateOfferingFilled />
                      </div>
                      <div>
                        <div class="text-primary2 u-title2">Offering</div>
                        <div class="mt-1 text-grey2 u-body2">
                          Show your skills to earn much more
                        </div>
                      </div>
                    </div>
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
      </>
    )
  }
})

export default CreateBlock
