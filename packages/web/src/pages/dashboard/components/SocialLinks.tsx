import { UButton, UAddress } from '@comunion/components'
import { GithubFilled, GoogleFilled, WalletOutlined } from '@comunion/icons'
import { defineComponent } from 'vue'
import { useUserStore } from '@/stores'

const SocialLinks = defineComponent({
  name: 'SocialLinks',
  setup(props, ctx) {
    const userStore = useUserStore()

    /**
     * @description connect social account
     */
    const connectLink = () => {
      // TODO
    }
    const socialLinks = [
      {
        avatar: GithubFilled,
        label: 'Github',
        link: 'https://github.com/'
      },
      {
        avatar: GoogleFilled,
        label: 'Google',
        link: 'https://accounts.google.com/'
      }
    ]
    return () => (
      <div class="w-88 flex flex-col h-full justify-between">
        <div>
          <div class="u-title1 u-primary2 mb-4">Social links</div>
          <div>
            {socialLinks.map(link => {
              return (
                <div key={link.label} class="flex items-center mb-6">
                  <link.avatar class="w-6 h-6 mr-3.5" />
                  <span class="u-title2 u-primary2">{link.label}</span>
                  <UButton
                    class="ml-auto bg-white rounded-lg w-30 text-primary2"
                    size="small"
                    type="primary"
                    ghost
                    onClick={connectLink}
                    style={{
                      '--n-border': '1px solid var(--u-primary-2-color)'
                    }}
                  >
                    Connect
                  </UButton>
                </div>
              )
            })}
          </div>
        </div>
        <div>
          <div class="u-title1 text-primary2 mb-4">Wallet Link</div>
          <div class="rounded bg-white flex items-center overflow-hidden py-2.5 px-4">
            <WalletOutlined class="text-primary mr-4" />
            {userStore.profile?.walletAddress ? (
              <UAddress address={userStore.profile.walletAddress} autoSlice={true} />
            ) : (
              <span class="text-grey3">Not bind</span>
            )}
          </div>
        </div>
      </div>
    )
  }
})

export default SocialLinks
