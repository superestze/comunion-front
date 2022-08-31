import { UStartupLogo } from '@comunion/components'
import { defineComponent } from 'vue'

export const ProposalCard = defineComponent({
  name: 'ProposalCard',
  render() {
    return (
      <div class="flex bg-white py-8 px-10 w-full">
        <div class="w-15 h-15">
          <UStartupLogo class="mr-2" src="" width="60" height="60" />
        </div>
        <div>
          <div class="flex items-center">
            <span class="mr-2">Linkedin by</span>
            <span>77777</span>
            <div class="status ml-auto"></div>
          </div>
          <div class="u-title3 truncate break-all max-w-200 my-2">
            ssdfsdfdfssdfsdfdfssdfsdfdfssdfsdfdfssdfsdfdfssdfsdfdfssdfsdfdfssdfsdfdfssdfsdfdfssdfsdfdfssdfsdfdfssdfsdfdfssdfsdfdfssdfsdfdfssdfsdfdf
          </div>
          <div class="u-body2 truncate break-all whitespace-pre-line line-clamp-2">
            We are looking to build landing pages templates to explain our products betterod landing
            page hitemplate for our H.Take a look at these
            pages:https://shop.gocase.wirelesscharger.https://shop.gocase.com/girls-case-1st-versionThe
            above was built using leadpages.Now we want to now build a really good landing page
            template for our Holiday GiftNow Holiday Holiday Holid...
          </div>
          <div class="text-grey3  mt-2">Starts in 12 hr</div>
        </div>
      </div>
    )
  }
})
