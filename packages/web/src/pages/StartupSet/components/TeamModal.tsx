import { FormFactoryField, UModal, UFormFactory, UButton } from '@comunion/components'
import ULazyImage from '@comunion/components/src/ULazyImage/LazyImage'
import { defineComponent, ref, PropType } from 'vue'
import styles from './teamSetting.module.css'
import { services } from '@/services'

const TeamModal = defineComponent({
  name: 'TeamModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    avatar: {
      type: String,
      default: ''
    },
    teamList: {
      type: Object as PropType<teamList>
    }
  },
  setup(props, ctx) {
    console.log(props.teamList, '==============')
    const selectedAvatar = ref(props.avatar)
    const fields: FormFactoryField[] = [
      {
        title: 'Roles',
        name: 'Roles',
        required: true,
        placeholder: 'Plealse position, link developer...'
      }
    ]
    const cancel = () => {
      ctx.emit('update:show', false)
      selectedAvatar.value = ''
    }

    const onSubmit = async (
      values: Parameters<typeof services['account@comer-profile-update']>[0]
    ) => {
      console.log(values)
      // const { error } = await services['startup@start-team-meabers-create']({

      // })

      // if (!error) {
      //   console.log(values)
      // }
    }

    const confirm = () => {
      // ctx.emit('update:avatar', selectedAvatar.value)
      // cancel()
      onSubmit()
    }

    const select = (avatarSrc: string) => {
      selectedAvatar.value = avatarSrc
    }

    const slots = {
      header: () => <div class="px-2 py-3 u-title1 text-20px">Team Setting</div>,
      footer: () => (
        <div class="text-right pb-3 pr-2">
          <UButton class="w-41 h-12 mr-4" onClick={cancel}>
            <span class="u-title2 text-primary">Cancel</span>
          </UButton>
          <UButton class="w-41 h-12" onClick={confirm} type="primary">
            Confirm
            <span class="u-title2 text-primary">Confirm</span>
          </UButton>
        </div>
      )
    }
    return () => (
      <>
        <section>
          <UModal
            bordered={false}
            size="small"
            preset="card"
            v-model:show={props.show}
            mask-closable={false}
            class="w-188 h-100 bg-white overflow-hidden"
            v-slots={slots}
          >
            <div class="h-25 m-4 bg-neutral-100 rounded-2xl ">
              <div class="flex flex-row">
                <div class="flex-3">
                  <ULazyImage
                    src="https://img0.baidu.com/it/u=636628865,1288536139&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667"
                    class="h-18 w-18 rounded justify-between mb-6 mr-4 cursor-pointer rounded-1\/2 ml-4 mt-4"
                  />
                </div>
                <div class="flex-7 ">
                  <div class="font-bold text-25px mt-5">{props.teamList.name}</div>
                  <div class="text-primary mt-5">{props.teamList.tokenContractAddress}</div>
                </div>
              </div>
              <div>
                <UFormFactory
                  fields={fields}
                  submitText="Confirm"
                  cancelText="Cancel"
                  onSubmit={onSubmit}
                  class={styles.bottom_submit}
                />
              </div>
            </div>
          </UModal>
        </section>
      </>
    )
  }
})

export default TeamModal
