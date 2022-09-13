import { UButton, UModal } from '@comunion/components'
import ULazyImage from '@comunion/components/src/ULazyImage/LazyImage'
import { HookFilled } from '@comunion/icons'
import { defineComponent, ref } from 'vue'
import avatars from '@/components/Profile/avatars'

const AvatarSelect = defineComponent({
  name: 'AvatarSelect',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    avatar: {
      type: String,
      default: ''
    }
  },
  setup(props, ctx) {
    const selectedAvatar = ref(props.avatar)

    const cancel = () => {
      ctx.emit('update:show', false)
    }

    const submit = () => {
      ctx.emit('update:avatar', selectedAvatar.value)
      cancel()
    }

    const select = (avatarSrc: string) => {
      selectedAvatar.value = avatarSrc
    }

    const slots = {
      header: () => <div class="py-3 px-2 u-title1">Choose your avatar</div>,
      footer: () => (
        <div class="text-right pr-2 pb-3">
          <UButton class="h-12 mr-4 w-41" onClick={cancel}>
            <span class="text-primary u-title2">Cancel</span>
          </UButton>
          <UButton class="h-12 w-41" onClick={submit} type="primary">
            <span class="text-white u-title2">Submit</span>
          </UButton>
        </div>
      )
    }

    return () => (
      <>
        <section>
          <UModal
            bordered={false}
            display-directive="if"
            size="small"
            preset="card"
            v-model:show={props.show}
            mask-closable={false}
            class="bg-white h-128 w-136 overflow-hidden"
            on-update:show={cancel}
            positive-text={'Submit'}
            v-slots={slots}
          >
            <div class="flex flex-wrap mt-6 px-2">
              {avatars.map(avatar => (
                <div key={avatar.src} onClick={() => select(avatar.src)}>
                  <div>
                    <div
                      class={`h-20 w-20 rounded-1/2 bg-grey1 opacity-50 absolute cursor-pointer flex items-center justify-center ${
                        selectedAvatar.value === avatar.src ? 'z-1' : '-z-1'
                      }`}
                    >
                      <HookFilled class="text-white" />
                    </div>
                    <ULazyImage
                      src={avatar.src}
                      class="rounded cursor-pointer h-20 mr-4 mb-6 w-20 justify-between"
                    />
                  </div>
                </div>
              ))}
            </div>
          </UModal>
        </section>
      </>
    )
  }
})

export default AvatarSelect
