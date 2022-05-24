import {
  PlusOutlined,
  CreateStartupFilled,
  CreateBountyFilled,
  CreateOfferingFilled
} from '@comunion/icons'
import { defineComponent, ref } from 'vue'
import HeaderDropdown from '../../components/HeaderDropdown'
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
        <HeaderDropdown
          width={356}
          title="Create"
          class={styles.dropdown}
          options={[
            {
              key: 'startup',
              label: () => (
                <div class="flex items-center" onClick={onCreateStartup}>
                  <div class="rounded flex bg-[#f8f8f8] h-8 mr-4 w-8 items-center justify-center">
                    <CreateStartupFilled class="text-primary" />
                  </div>
                  <div>
                    <div class="text-primary1 u-title2">Startup</div>
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
                    <CreateBountyFilled class="text-primary" />
                  </div>
                  <div>
                    <div class="text-primary1 u-title2">Bounty</div>
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
                    <CreateOfferingFilled class="text-primary" />
                  </div>
                  <div>
                    <div class="text-primary1 u-title2">Offering</div>
                    <div class="mt-1 text-grey2 u-body2">Show your skills to earn much more</div>
                  </div>
                </div>
              )
            }
          ]}
        >
          <button class={[styles.btn, ctx.attrs.class]}>
            <PlusOutlined class="h-6 mr-1.5 text-white w-6" />
            <span class="text-white u-body1">CREATE</span>
          </button>
        </HeaderDropdown>
      </>
    )
  }
})

export default CreateBlock
