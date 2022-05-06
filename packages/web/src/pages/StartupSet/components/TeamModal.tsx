import { UModal, UFormItemsFactory, UButton, UAddress } from '@comunion/components'
import ULazyImage from '@comunion/components/src/ULazyImage/LazyImage'
import { defineComponent, inject, reactive, ref } from 'vue'

// interface teamList {
//   comerProfile: any | null | undefined
//   comer: any | null | undefined
//   Address: any | null | undefined
//   startupID: number | null | undefined
//   comerID: number | null | undefined
//   position: string | null | undefined
// }

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
      type: Object,
      required: true
    }
  },
  setup(props, ctx) {
    // const selectedAvatar = ref(props.avatar)
    const fields = [
      {
        title: 'Roles',
        name: 'roles',
        roles: '',
        required: true,
        placeholder: 'Enter roles,link developer...',
        maxlength: 50
      }
    ]

    const address = ref<string>('')
    const defaultModel = {
      roles: props.teamList?.position,
      id: props.teamList?.startupID,
      comerId: props.teamList.comerProfile?.comerID
    }
    if (props.teamList?.comer) {
      address.value = props.teamList?.comer.Address
    } else {
      address.value = props.teamList?.Address
    }
    const value = reactive({
      ...{
        ...defaultModel
      }
    })
    const PARENT_PROVIDE = 'parentProvide'
    // const parent = inject(PARENT_PROVIDE)
    const parentTestFun: any = inject(`${PARENT_PROVIDE}/teamCreate`)
    const parentUpDateFun: any = inject(`${PARENT_PROVIDE}/upDate`)
    // const cancel = () => {
    //   ctx.emit('update:show', false)
    //   selectedAvatar.value = ''
    // }
    function onCancel() {
      Object.assign(value, {
        ...{
          ...defaultModel
        }
      })
      ctx.emit('update:show', false)
    }
    const onSubmit = () => {
      if (props.teamList?.comer) {
        parentUpDateFun?.(value)
      } else {
        parentTestFun?.(value)
      }
      onCancel()
    }

    const slots = {
      header: () => <div class="px-2 py-3 u-title1 text-20px">Team Setting</div>
    }
    return () => (
      <>
        <section>
          <UModal
            bordered={true}
            size="small"
            preset="card"
            v-model:show={props.show}
            mask-closable={true}
            class="w-188 h-100 bg-white overflow-hidden m-auto"
            v-slots={slots}
            aria-modal={true}
            on-update:show={onCancel}
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
                  {!props.show}
                  <div class="font-bold text-25px mt-5">{props.teamList.comerProfile?.name}</div>
                  <div class="text-primary mt-5">
                    <UAddress
                      autoSlice={true}
                      class="ml-1.5 u-body2 text-primary"
                      address={address.value}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="h-25 m-4  ">
              <UFormItemsFactory fields={fields} values={value} />
            </div>
            <div class="text-center">
              <UButton type="primary" size="large" class="w-41  " onClick={onSubmit}>
                Submit
              </UButton>
            </div>
          </UModal>
        </section>
      </>
    )
  }
})

export default TeamModal
