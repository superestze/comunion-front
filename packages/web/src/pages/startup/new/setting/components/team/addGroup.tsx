import { UButton, UCard, UInput, UModal } from '@comunion/components'
import { DeleteFilled, PlusOutlined } from '@comunion/icons'
import { defineComponent, ref, watch, PropType } from 'vue'
import { GroupItem } from '../../../hooks/useGroup'
import { services } from '@/services'

export default defineComponent({
  name: 'AddGroup',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    group: {
      type: Object as PropType<GroupItem[]>
    },
    startupId: {
      type: [String, Number],
      required: true
    }
  },
  setup(props, ctx) {
    const list = ref<GroupItem[]>([])

    watch(
      () => props.group,
      () => {
        list.value = [...(props.group || [])]
      },
      {
        immediate: true
      }
    )

    const closeDialog = () => {
      ctx.emit('triggerDialog')
      list.value = [...(props.group || [])]
    }

    return {
      list,
      startupId: props.startupId,
      closeDialog
    }
  },
  emits: ['triggerDialog', 'triggerUpdate'],
  render() {
    const userBehavier = (type: string) => () => {
      if (type === 'cancel') {
        return this.closeDialog()
      }
      if (!this.startupId) {
        return console.warn('this.startupId is missing')
      }
      // delete list
      const delList = this.list.filter(e => {
        return e.id && e.delete
      })
      const delQueue = delList.map(item =>
        services['startup@delete-group']({
          groupID: item.id
        })
      )
      // add list
      const addList = this.list.filter(e => {
        return !e.delete && e.id === 0 && e.name.trim().length && e.name !== 'All'
      })
      console.log('addList', addList)
      const addQueue = addList.map(item =>
        services['startup@create-group']({
          startupID: this.startupId,
          name: item.name
        })
      )
      // request
      Promise.all([...delQueue, ...addQueue]).then(() => {
        this.closeDialog()
        this.$emit('triggerUpdate')
      })
    }

    const addGroup = () => {
      this.list.push({ id: 0, name: '' })
    }

    const removeGroup = (index: number) => () => {
      // this.list.splice(index, 1)
      const currentList = this.list.filter(e => e.name !== 'All' && !e.delete)
      currentList[index]['delete'] = true
    }
    return (
      <UModal show={this.visible}>
        <UCard
          style="width: 400px"
          title="Group management"
          bordered={false}
          size="huge"
          role="dialog"
          aria-modal="true"
          closable
          onClose={userBehavier('cancel')}
        >
          <>
            <div class="h-9.5 w-full"></div>
            {this.list
              .filter(e => e.name !== 'All' && !e.delete)
              .map((group, index) => (
                <div class="flex mb-4 items-center">
                  <UInput
                    placeholder="Group Name"
                    v-model:value={group.name}
                    maxlength={200}
                    v-slots={{
                      suffix: () =>
                        this.list.length > 1 && group.name.trim().length ? (
                          <DeleteFilled
                            class="cursor-pointer h-3 ml-4.5 text-grey3 w-3"
                            onClick={removeGroup(index)}
                          />
                        ) : null
                    }}
                  />
                </div>
              ))}
            <UButton dashed class="w-full u-body2" onClick={addGroup}>
              <span class="flex text-grey3 items-center u-body2">
                <PlusOutlined class="h-4 mr-3 w-4" />
                Add
              </span>
            </UButton>
            <div class="flex mt-40px justify-end">
              <UButton class="w-40" type="primary" onClick={userBehavier('submit')} size="small">
                Save
              </UButton>
            </div>
          </>
        </UCard>
      </UModal>
    )
  }
})
