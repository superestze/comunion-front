import { UButton } from '@comunion/components'
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
      <div>
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
          <div class="text-[20px] font-600 leading-6 font-opensans">Associated Wallet Links</div>
          {/*TODO after wallet address component completed, replace this */}
          <div class="w-77 h-10 rounded-4px leading-10 mb-11 bg-white">{`${wallet?.walletAddress?.substring(
            0,
            10
          )}...${wallet?.walletAddress?.substring(wallet.walletAddress.length - 4)}`}</div>
        </div>
      </div>
    )
  }
})

export default SocialLinks
