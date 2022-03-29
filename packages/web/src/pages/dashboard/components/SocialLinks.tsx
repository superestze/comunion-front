import { UButton } from '@comunion/components'
import { FacebookFilled, LinkInFilled, PinterestFilled } from '@comunion/icons'
import { defineComponent } from 'vue'
import styles from './SocialLinks.module.css'
import { useWallet } from '@/providers'

const SocialLinks = defineComponent({
  name: 'SocialLinks',
  setup(props, ctx) {
    const { wallet } = useWallet()
    const socialLinks = [
      {
        avatar: 'LinkInFilled',
        label: 'linkedin',
        link: 'https://www.facebook.com'
      },
      {
        avatar: 'FacebookFilled',
        label: 'Facebook',
        link: 'https://www.linkedin.cn'
      },
      {
        avatar: 'PinterestFilled',
        label: 'Pinterest',
        link: 'https://www.pinterest.com/'
      }
    ]
    return () => (
      <div>
        <div class={styles.socialLinks}>
          <div class={styles.linksTitle}>Social links</div>
          <div class={styles.linksContent}>
            {socialLinks.map(link => {
              return (
                <div class={styles.linksContentItems}>
                  {link.avatar === 'FacebookFilled' ? (
                    <FacebookFilled class={styles.linksContentItemsAvatar} />
                  ) : (
                    ''
                  )}
                  {link.avatar === 'LinkInFilled' ? (
                    <LinkInFilled class={styles.linksContentItemsAvatar} />
                  ) : (
                    ''
                  )}
                  {link.avatar === 'PinterestFilled' ? (
                    <PinterestFilled class={styles.linksContentItemsAvatar} />
                  ) : (
                    ''
                  )}
                  <span class={styles.linksContentItemsLabel}>{link.label}</span>
                  <UButton
                    class={styles.linksContentItemsBtn}
                    size="small"
                    onClick={() => window.open(link.link)}
                  >
                    Connect
                  </UButton>
                </div>
              )
            })}
          </div>
        </div>
        <div class={styles.walletLinks}>
          <div class={styles.linksTitle}>Associated Wallet Links</div>
          <div class={styles.linksContent}>{`${wallet?.walletAddress?.substring(
            0,
            10
          )}...${wallet?.walletAddress?.substring(wallet.walletAddress.length - 4)}`}</div>
        </div>
      </div>
    )
  }
})

export default SocialLinks
