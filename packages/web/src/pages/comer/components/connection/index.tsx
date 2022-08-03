import { UCard, UStartupLogo } from '@comunion/components'
import { defineComponent } from 'vue'
import ListItem from './listItem'

import Switch from './switch'
import LoadingBtn from '@/components/More/loading'

export default defineComponent({
  render() {
    const tabsChange = () => {
      // todo
    }
    const handleMore = () => {
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
                    <UStartupLogo src={''} width="9" height="9" />
                  </div>
                )
              }}
            />
            <ListItem
              v-slots={{
                avatar: () => (
                  <div class="flex items-center">
                    <UStartupLogo src={''} width="9" height="9" />
                  </div>
                )
              }}
            />
            <div class="flex justify-center mt-5">
              <LoadingBtn onMore={handleMore} end={false} />
            </div>
          </div>
        </div>
      </UCard>
    )
  }
})
