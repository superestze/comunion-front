import { UModal, UFormItemsFactory, UButton } from '@comunion/components'
import ULazyImage from '@comunion/components/src/ULazyImage/LazyImage'
import { defineComponent, PropType, inject, reactive } from 'vue'

interface teamList {
  id: number | null | undefined
  comerID: number | null | undefined
  roles: string | null | undefined
  name: string | null | undefined
  tokenContractAddress: string | null | undefined
  comerProfile: any | null | undefined
}

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
      type: Object as PropType<teamList>,
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
        placeholder: 'Plealse position, link developer...'
      }
    ]
    const defaultModel = {
      roles: props.teamList?.roles,
      id: props.teamList?.id,
      comerId: props.teamList?.comerID
    }

    const value = reactive({
      ...{
        ...defaultModel
      }
    })
    const PARENT_PROVIDE = 'parentProvide'
    // const parent = inject(PARENT_PROVIDE)
    const parentTestFun = inject(`${PARENT_PROVIDE}/teamCreate`)
    const parentUpDataFun = inject(`${PARENT_PROVIDE}/upData`)
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
      if (props.teamList?.roles) {
        if (parentUpDataFun instanceof Function) parentUpDataFun(value)
      } else {
        if (parentTestFun instanceof Function) parentTestFun(value)
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
                  <div class="font-bold text-25px mt-5">{props.teamList?.name}</div>
                  <div class="text-primary mt-5">{props.teamList?.tokenContractAddress}</div>
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
