import { UButton, UCard, UStartupLogo } from '@comunion/components'
import { ArrowDownOutlined } from '@comunion/icons'
import { defineComponent } from 'vue'
import ListItem from './listItem'

import Switch from './switch'

export default defineComponent({
  render() {
    const tabsChange = () => {
      // todo
    }
    return (
      <UCard title="CONNECTED" class="mb-6">
        <div class="flex flex-col mt-6">
          <Switch onSwitchPanel={tabsChange} />
          <div class="flex flex-col">
            <ListItem
              v-slots={{
                avatar: () => (
                  <div class="flex items-center">
                    <UStartupLogo src={''} width="10" height="10" class="h-10 w-10" />
                  </div>
                )
              }}
            />
            <UButton quaternary type="primary">
              More
              <ArrowDownOutlined />
            </UButton>
          </div>
        </div>
      </UCard>
    )
  }
})
