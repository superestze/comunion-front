import { UButton, UAddress } from '@comunion/components'
import { GithubFilled, GoogleFilled } from '@comunion/icons'
import { defineComponent } from 'vue'
import { useWallet } from '@/providers'

const SocialLinks = defineComponent({
  name: 'SocialLinks',
  setup(props, ctx) {
    const { wallet } = useWallet()

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
      <div class="flex flex-col h-full justify-between">
        <div>
          <div class="text-[20px] font-600 leading-6 font-opensans">Social links</div>
          <div>
            {socialLinks.map(link => {
              return (
                <div class="flex items-center h-18 leading-18">
                  <link.avatar class="w-6 h-6 mr-6" />
                  <span class="font-opensans font-600 text-[16px] mr-18 w-18 inline-block">
                    {link.label}
                  </span>
                  <UButton
                    class="bg-white rounded-2px w-30 h-9 p-1 font-opensans font-600 text-[16px] text-primary"
                    size="small"
                    onClick={connectLink}
                  >
                    Connect
                  </UButton>
                </div>
              )
            })}
          </div>
        </div>
        <div>
          <div class="text-[20px] font-600 leading-6 font-opensans mb-4">
            Associated Wallet Links
          </div>
          <div class="w-77 h-10 rounded-4px leading-10 bg-white flex overflow-hidden">
            <UAddress address={wallet?.walletAddress} autoSlice={true} />
          </div>
        </div>
      </div>
    )
  }
})

export default SocialLinks
