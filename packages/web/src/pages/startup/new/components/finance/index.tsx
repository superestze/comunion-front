import { UCard } from '@comunion/components'
import { defineComponent } from 'vue'
import Copy from '@/components/Copy'

export default defineComponent({
  render() {
    return (
      <UCard title="FINANCE" class="mb-6">
        <div class="flex flex-col mr-10">
          <div class="flex mt-4">
            <p class="u-body2 text-grey3 w-38">Launch Network：</p>
            <p class="u-body2 text-primary2">Avalanche C-Chain</p>
          </div>
          <div class="flex mt-4">
            <p class="u-body2 text-grey3 w-38">Token Name：</p>
            <p class="u-body2 text-primary2">Universal Value Units</p>
          </div>
          <div class="flex mt-4">
            <p class="u-body2 text-grey3 w-38">Token Symbol：</p>
            <p class="u-body2 text-primary2">UVU</p>
          </div>
          <div class="flex mt-4">
            <p class="u-body2 text-grey3 w-38">Token Supply：</p>
            <p class="u-body2 text-primary2">1,000,000,000</p>
          </div>
          <div class="flex mt-4">
            <p class="u-body2 text-grey3 w-38">Token Concract：</p>
            <p class="u-body2 text-primary flex items-center">
              0XEfh3......450d <Copy content="123123" />
            </p>
          </div>
          <div class="flex mt-4">
            <p class="u-body2 text-grey3 w-38">Presale :</p>
            <p class="u-body2 text-primary2">2022-05-31 ~ 2022-06-04 UTC</p>
          </div>
          <div class="h-1px w-full bg-grey5 mt-6.5"></div>
          <div class="flex mt-5.5">
            <p class="u-body2 text-grey3 w-38">Presale wallet：</p>
            <div class="flex flex-col">
              <p class="u-body2 text-primary flex items-center">
                0XEfh3......450d <Copy content="123123" />
              </p>
              <p class="u-body2 text-primary flex items-center">
                0XEfh3......450d <Copy content="123123" />
              </p>
            </div>
          </div>
        </div>
      </UCard>
    )
  }
})
