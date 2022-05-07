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
      header: () => <div class="px-2 py-3 u-title1">Choose your avatar</div>,
      footer: () => (
        <div class="text-right pb-3 pr-2">
          <UButton class="w-41 h-12 mr-4" onClick={cancel}>
            <span class="u-title2 text-primary">Cancel</span>
          </UButton>
          <UButton class="w-41 h-12" onClick={submit} type="primary">
            <span class="u-title2 text-white">Submit</span>
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
            class="w-136 h-128 bg-white overflow-hidden"
            on-update:show={cancel}
            positive-text={'Submit'}
            v-slots={slots}
          >
            <div class="px-2 flex flex-wrap mt-6">
              {avatars.map(avatar => (
                <div key={avatar.src} onClick={() => select(avatar.src)}>
                  <div>
                    <div
                      class={`h-20 w-20 rounded-1/2 bg-grey1 opacity-50 absolute cursor-pointer flex items-center justify-center ${
                        selectedAvatar.value === avatar.src ? 'z-1' : '-z-1'
                      }`}
                    >
                      <HookFilled />
                    </div>
                    <ULazyImage
                      src={avatar.src}
                      class="h-20 w-20 rounded justify-between mb-6 mr-4 cursor-pointer"
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
