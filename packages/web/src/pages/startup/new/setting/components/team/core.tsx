import { ULazyImage, UPaginatedList, UPaginatedListPropsType } from '@comunion/components'
import { DeleteFilled, PenOutlined, SettingOutlined } from '@comunion/icons'
import dayjs from 'dayjs'
import { defineComponent, ref, computed } from 'vue'
import AddGroup from './addGroup'
import AddTeamMember from './addTeamMember'
import module from './hover.module.css'
import { ModuleTags } from '@/components/Tags'
import { ServiceReturn, services } from '@/services'

type ListType = NonNullable<ServiceReturn<'startup@start-team-meabers-list'>>['list']

export default defineComponent({
  props: {
    startupId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const group = ref<string[]>(['All', 'Developer', 'Product manager', 'UI/UE'])
    console.log(`${module['list-hover']}`, props.startupId)

    const dataService = computed<UPaginatedListPropsType['service']>(
      () => async (page, pageSize) => {
        const { error, data } = await services['startup@start-team-meabers-list']({
          startupId: props.startupId,
          limit: pageSize,
          offset: pageSize * (page - 1)
        })
        return { items: error ? [] : data!.list!, total: error ? 0 : data!.total }
      }
    )

    const addGroupVisible = ref<boolean>(false)
    return {
      group,
      dataService,
      addGroupVisible
    }
  },
  emits: ['selectedTagChange'],
  render() {
    const handleSelectedChange = (selectedList: string[]) => {
      this.$emit('selectedTagChange', selectedList)
    }
    const handleCurrentRecord = (type: string) => () => {
      // todo
    }
    const handleGroupDialog = () => {
      this.addGroupVisible = !this.addGroupVisible
    }

    return (
      <div class="bg-white rounded-lg border mb-6 relative overflow-hidden min-h-205.5">
        <div class="mx-10 my-9.5 flex flex-col">
          <AddGroup visible={this.addGroupVisible} onTriggerDialog={handleGroupDialog} />
          <AddTeamMember startupId={this.startupId} />
          <div class="flex items-center mb-8">
            <ModuleTags tasks={this.group} onSelectedChange={handleSelectedChange} />
            <div class="flex ml-2 w-4 h-4" onClick={handleGroupDialog}>
              <SettingOutlined class="w-full" />
            </div>
          </div>
          <UPaginatedList
            service={this.dataService}
            children={({ dataSource: list }: { dataSource: ListType }) => {
              return (
                <div class="flex flex-col">
                  {list.map(item => (
                    <div
                      class={`rounded-6px flex justify-between items-center cursor-pointer ${module['list-hover']}`}
                    >
                      <div class="m-4 flex items-center">
                        <div class="w-15 h-15 rounded-1/2">
                          <ULazyImage class="w-full" src={item.comerProfile?.avatar || ''} />
                        </div>
                        <div class="flex flex-col ml-6">
                          <p class="u-title2">{item.comerProfile?.name}</p>
                          <p class="text-12px font-400 text-grey1 mt-1">
                            {item.comerProfile?.skills.length > 0 &&
                              item.comerProfile?.skills
                                .map((skill: { name: string }) => skill.name)
                                .join(',')}
                          </p>
                        </div>
                      </div>

                      <div class="u-body2 text-grey3">
                        Join {dayjs(item.CreatedAt).format('MMMM D, YYYY')}
                      </div>
                      <p class="flex text-grey3 change mr-9">
                        <PenOutlined
                          class=" w-4 h-4 mr-4.5"
                          onClick={handleCurrentRecord('edit')}
                        />
                        <DeleteFilled class=" w-4 h-4" onClick={handleCurrentRecord('del')} />
                      </p>
                    </div>
                  ))}
                </div>
              )
            }}
          />
        </div>
      </div>
    )
  }
})
