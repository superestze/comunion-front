import { UButton, UModal } from '@comunion/components'
import { GithubFilled, GoogleFilled } from '@comunion/icons'
import { defineComponent, ref } from 'vue'
import DialogContent from '../DialogContent'
import OAuthLinkBtn from './OAuthLinkBtn'

export default defineComponent({
  name: 'OAuthLinkWidget',
  setup() {
    const associateWalletVisible = ref<boolean>(false)
    const associateAccountVisible = ref<boolean>(false)

    const handleGoogleLink = () => {
      associateAccountVisible.value = !associateAccountVisible.value
    }

    return () => (
      <>
        <UModal show={associateWalletVisible.value} onMaskClick={handleGoogleLink}>
          <DialogContent
            title="Associating existing accounts"
            config={{ width: 524 }}
            v-slots={{
              content: () => (
                <p>
                  If you already have data from another account at comunion, you can associate it
                  with that account.
                </p>
              ),
              footer: () => (
                <div class="flex justify-end mt-40px">
                  <UButton onClick={handleGoogleLink} class="w-160px">
                    Cancel
                  </UButton>
                  <UButton type="primary" class="ml-10px w-160px">
                    Connect Wallet
                  </UButton>
                </div>
              )
            }}
          />
        </UModal>
        <UModal show={associateAccountVisible.value} onMaskClick={handleGoogleLink}>
          <DialogContent
            title="Associating existing accounts"
            config={{ width: 524 }}
            v-slots={{
              content: () => (
                <p>
                  If you already have data from another account at comunion, you can associate it
                  with that account.
                </p>
              ),
              footer: () => (
                <div class="flex justify-end mt-40px">
                  <UButton onClick={handleGoogleLink} class="w-124px">
                    Cancel
                  </UButton>
                  <UButton onClick={handleGoogleLink} class="w-124px ml-14px">
                    <GoogleFilled class="w-5 h-5 mr-3.5 text-primary" />
                    Link
                  </UButton>
                  <UButton onClick={handleGoogleLink} class="w-124px ml-14px">
                    <GithubFilled class="w-5 h-5 mr-3.5 text-primary" />
                    Link
                  </UButton>
                </div>
              )
            }}
          />
        </UModal>
        <div class="mr-4">
          <OAuthLinkBtn onTriggerClick={handleGoogleLink}>
            <>
              <GoogleFilled class="w-5 h-5 mr-3.5 text-primary" />
              <span class="u-title2 text-primary">Link</span>
            </>
          </OAuthLinkBtn>
        </div>
        <div class="mr-4">
          <OAuthLinkBtn>
            <>
              <GithubFilled class="w-5 h-5 mr-3.5 text-primary" />
              <span class="u-title2 text-primary">Linked</span>
            </>
          </OAuthLinkBtn>
        </div>
      </>
    )
  }
})
