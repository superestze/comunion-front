import { ULazyImage, UPaginatedList, UPaginatedListPropsType, message } from '@comunion/components'
import { DeleteFilled, PenOutlined, SettingOutlined } from '@comunion/icons'
import dayjs from 'dayjs'
import { defineComponent, ref, computed, toRaw, provide } from 'vue'
import { useGroup } from '../../../hooks/useGroup'
import AddGroup from './addGroup'
import AddTeamMember from './addTeamMember'
import AddTeamMemberDialog, { editComerData } from './addTeamMemberDialog'
import defaultAvatar from './assets/avatar.png?url'
import module from './hover.module.css'
import { ModuleTags } from '@/components/Tags'
import { ServiceReturn, services } from '@/services'

type ListType = NonNullable<ServiceReturn<'startup@startup-group-member-list'>>['rows']

export default defineComponent({
  name: 'TeamSetting',
  props: {
    startupId: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const teamGroup = useGroup()
    const updateGroupList = () => {
      teamGroup.get(String(props.startupId))
    }
    updateGroupList()

    // current group
    const currentGroup = ref()

    const dataService = computed<UPaginatedListPropsType['service']>(
      () => async (page, pageSize) => {
        // const { error, data } = await services['startup@start-team-meabers-list']({
        //   startupId: props.startupId,
        //   limit: pageSize,
        //   offset: pageSize * (page - 1)
        // })
        // return { items: error ? [] : data!.list!, total: error ? 0 : data!.total }
        // TODO
        // group fileter
        const { error, data } = await services['startup@startup-group-member-list']({
          startupId: props.startupId,
          groupID: currentGroup.value || 0,
          limit: pageSize,
          page
        })
        return { items: error ? [] : data!.rows || [], total: error ? 0 : data.totalRows }
      }
    )

    const addGroupVisible = ref<boolean>(false)

    const groupList = computed(() => {
      return [
        {
          id: 0,
          name: 'All'
        },
        ...toRaw(teamGroup.group.value)
      ]
    })

    provide('group', groupList)

    type comerProfile = {
      comerProfile: {
        avatar: string
        comerID: number
        name: string
        position: string
      }
      createdAt: string
    }

    // member edit
    const editMemberProfile = ref<editComerData>()
    const editMemberVisible = ref(false)
    const refreshMark = ref(true)
    const updateMemberList = () => {
      refreshMark.value = false
      setTimeout(() => {
        refreshMark.value = true
      })
    }

    const handleCreateComer = (newProfile: comerProfile) => {
      console.warn(newProfile)
      editMemberProfile.value = {
        comerAvatar: newProfile.comerProfile.avatar,
        comerId: newProfile.comerProfile.comerID,
        comerName: newProfile.comerProfile.name,
        joinedTime: newProfile.createdAt,
        position: newProfile.comerProfile.position,
        isNew: true
      }
      editMemberVisible.value = true
    }

    const handleMemberAction = (type: string, item: editComerData) => {
      // member act
      if (type === 'del') {
        services['startup@start-team-meabers-delete']({
          startupId: props.startupId,
          comerId: item.comerId
        }).then(res => {
          if (!res.error) {
            message.success('Deleted successfully!')
            updateMemberList()
          }
        })
      } else if (type === 'edit') {
        editMemberProfile.value = item
        editMemberVisible.value = true
      }
    }

    return {
      startupId: props.startupId,
      group: groupList,
      dataService,
      addGroupVisible,
      updateGroupList,
      currentGroup,
      editMemberProfile,
      editMemberVisible,
      updateMemberList,
      handleCreateComer,
      handleMemberAction,
      refreshMark
    }
  },
  render() {
    const handleToggleGroup = (selectedList: string[]) => {
      const selectGroupName = selectedList[0]
      const selectGroupIndex = this.group.findIndex(group => group.name === selectGroupName)
      if (selectGroupIndex !== -1) {
        this.currentGroup = this.group[selectGroupIndex].id
        console.warn('currentGroup', this.currentGroup)
      }
    }

    return (
      <div class="bg-white border rounded-lg mb-6 min-h-205.5 relative overflow-hidden">
        <div class="flex flex-col my-9.5 mx-10">
          <AddTeamMember
            startupId={String(this.startupId)}
            group={this.group}
            onTriggerNewComer={this.handleCreateComer}
          />
          <AddTeamMemberDialog
            startupId={String(this.startupId)}
            comer={this.editMemberProfile}
            visible={this.editMemberVisible}
            onTriggerDialog={() => (this.editMemberVisible = false)}
            onTriggerActionDone={this.updateMemberList}
          />
          <div class="flex mb-8 items-center">
            <ModuleTags
              radio
              tasks={this.group.map(e => e.name)}
              onSelectedChange={handleToggleGroup}
            />
            <div
              class="cursor-pointer flex h-4 ml-2 w-4"
              onClick={() => (this.addGroupVisible = !this.addGroupVisible)}
            >
              <SettingOutlined class="w-full text-grey3 hover:text-[#5331F4]" />
            </div>
            <AddGroup
              group={this.group}
              visible={this.addGroupVisible}
              startupId={this.startupId}
              onTriggerDialog={() => (this.addGroupVisible = !this.addGroupVisible)}
              onTriggerUpdate={this.updateGroupList}
            />
          </div>
          {this.refreshMark && (
            <UPaginatedList
              service={this.dataService}
              children={({ dataSource: list }: { dataSource: ListType }) => {
                return (
                  <div class="flex flex-col">
                    {list.map(item => (
                      <div
                        class={`rounded-6px flex justify-between items-center cursor-pointer ${module['list-hover']}`}
                      >
                        <div class="flex m-4 w-1/2 items-center">
                          <div class="bg-light-700 rounded-1/2 h-15 w-15">
                            <ULazyImage class="w-full" src={item.comerAvatar || defaultAvatar} />
                          </div>
                          <div class="flex flex-col ml-6">
                            <p class="font-orbitron u-title2">{item.comerName}</p>
                            <p class="font-400 mt-1 text-12px text-grey1 truncate ">
                              {/* {item.groupName && <span class="mr-2">{item.groupName}</span>} */}
                              <span>{item.position || ''}</span>
                            </p>
                          </div>
                        </div>

                        <div class="text-grey3 u-body2">
                          Join {dayjs(item.joinedTime).format('MMMM D, YYYY')}
                        </div>
                        <p class="flex mr-9 text-grey3 change">
                          <PenOutlined
                            class=" h-4 mr-4.5 w-4 hover:text-[#5331F4]"
                            onClick={() => this.handleMemberAction('edit', item)}
                          />
                          <DeleteFilled
                            class=" h-4 w-4 hover:text-[#5331F4]"
                            onClick={() => this.handleMemberAction('del', item)}
                          />
                        </p>
                      </div>
                    ))}
                  </div>
                )
              }}
            />
          )}
        </div>
      </div>
    )
  }
})
