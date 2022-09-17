import {
  ULazyImage,
  UPaginatedList,
  UPaginatedListPropsType,
  message,
  UModal,
  UCard,
  UButton
} from '@comunion/components'
import { DeleteFilled, PenOutlined, SettingOutlined, WarningFilled } from '@comunion/icons'
import dayjs from 'dayjs'
import { defineComponent, ref, computed, toRaw, provide } from 'vue'
import AddGroup from './addGroup'
import AddTeamMember from './addTeamMember'
import AddTeamMemberDialog, { editComerData } from './addTeamMemberDialog'
import defaultAvatar from './assets/avatar.png?url'
import './style.css'
import { ModuleTags } from '@/components/Tags'
import { useGroup } from '@/pages/startup/hooks/useGroup'
import { ServiceReturn, services } from '@/services'

type ListType = NonNullable<ServiceReturn<'startup@startup-group-member-list'>>['rows']

export default defineComponent({
  name: 'TeamSetting',
  props: {
    startupId: {
      type: [String, Number],
      required: true
    },
    founderId: {
      type: Number
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

    // showDeleteDialog
    const showDeleteDialog = ref<boolean>(false)
    const deleteItem = ref<any>(null)
    const showDeleteLoading = ref<boolean>(false)

    const handleMemberAction = (type: string, item: editComerData) => {
      // member act
      if (type === 'del') {
        showDeleteLoading.value = true
        services['startup@start-team-meabers-delete']({
          startupId: props.startupId,
          comerId: item.comerId
        }).then(res => {
          if (!res.error) {
            message.success('successfully deleted')
            updateMemberList()
            deleteItem.value = null
            showDeleteDialog.value = false
            showDeleteLoading.value = false
          }
        })
      } else if (type === 'edit') {
        editMemberProfile.value = item
        editMemberVisible.value = true
      }
    }

    return {
      startupId: props.startupId,
      founderId: props.founderId,
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
      refreshMark,
      showDeleteDialog,
      deleteItem,
      showDeleteLoading
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
      <div class="bg-white border rounded-sm mb-6 min-h-200 p-10 relative overflow-hidden">
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
            <SettingOutlined class="w-full text-color3 hover:text-[#5331F4]" />
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
                      class={`rounded-sm flex justify-between items-center cursor-pointer startup-team-list p-4 hover:bg-color-hover`}
                    >
                      <div
                        class="flex w-1/2 items-center"
                        onClick={() => {
                          this.$router.push({ path: '/comer', query: { id: item.comerId } })
                        }}
                      >
                        <ULazyImage
                          class="rounded-1/2 h-15 w-15"
                          src={item.comerAvatar || defaultAvatar}
                        />
                        <div class="flex flex-col ml-4">
                          <p class="text-color1 u-h4">{item.comerName}</p>
                          <p class="text-color3 truncate u-h7 ">
                            {/* {item.groupName && <span class="mr-2">{item.groupName}</span>} */}
                            <span>{item.position || ''}</span>
                          </p>
                        </div>
                      </div>

                      <div class="text-color3 u-h6">
                        Join {dayjs(item.joinedTime).format('MMMM D, YYYY')}
                      </div>
                      <p class={` text-color3 w-15 change`}>
                        <PenOutlined
                          class=" h-4 mr-4 w-4 hover:text-primary"
                          onClick={() => this.handleMemberAction('edit', item)}
                        />
                        {this.founderId !== item.comerId && (
                          <DeleteFilled
                            class=" h-4 w-4 hover:text-primary"
                            onClick={() => {
                              this.deleteItem = item
                              this.showDeleteDialog = true
                            }}
                          />
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              )
            }}
          />
        )}
        {/* delete confirm */}
        <UModal v-model:show={this.showDeleteDialog} mask-closable={false}>
          <UCard
            style={{ width: '540px' }}
            closable={true}
            onClose={() => (this.showDeleteDialog = false)}
            v-slots={{
              header: () => {
                return (
                  <div class="flex relative items-center">
                    <WarningFilled class="mr-4" />{' '}
                    <span class="text-color1 u-h3">Remove team members</span>
                  </div>
                )
              }
            }}
          >
            <div class="min-h-20 p-4 text-color2 u-h6">
              Are you sure you want to remove "{this.deleteItem?.comerName}" from the team list?
            </div>
            <div class="flex mt-4 justify-end">
              <UButton
                type="primary"
                ghost
                class="mr-4 w-41"
                onClick={() => (this.showDeleteDialog = false)}
              >
                Cancel
              </UButton>
              <UButton
                type="primary"
                class="w-41"
                loading={this.showDeleteLoading}
                onClick={() => this.handleMemberAction('del', this.deleteItem)}
              >
                Yes
              </UButton>
            </div>
          </UCard>
        </UModal>
      </div>
    )
  }
})
