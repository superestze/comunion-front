import { MenuOption, UBreadcrumb, USpin } from '@comunion/components'
import { defineComponent, ref, computed, unref } from 'vue'
import { useRoute } from 'vue-router'
import Dapp from './components/dapp'
import Finance from './components/finance'
import Governance from './components/governance'
import Info from './components/info'
import Menu from './components/menu'
import Security from './components/security'
import Sequence from './components/sequence'
import Social from './components/social'
import { contactList } from './components/social/util'
import Team from './components/team'
import { useStartup } from '@/pages/startup/hooks/useStartup'
export const getContactList = (startupInfo: { [x: string]: any }) => {
  return contactList.map(item => {
    const value = unref(startupInfo)[item.name]
    return {
      // socialType: value ? item.value : 0,
      socialType: item.value,
      socialLink: value
    }
  })
  // .filter(e => e.socialType !== 0)
}

export default defineComponent({
  setup() {
    const loading = ref<boolean>(false)
    const currentEditComponent = ref<string>('INFO')
    const startup = useStartup()
    const route = useRoute()
    startup.get(route.params.id as string)

    const socialList = computed(() => {
      const list = getContactList(startup.detail).filter(item => !!item.socialLink)

      return list.length ? list : [{ socialType: 1, socialLink: '' }]
    })

    return {
      loading,
      currentEditComponent,
      startup: startup.detail,
      route,
      socialList
    }
  },
  render() {
    const handleRouterChange = (data: { key: string; item: MenuOption }) => {
      console.log(data)
      this.currentEditComponent = data.key
    }
    return (
      <USpin show={this.loading}>
        <UBreadcrumb class="mt-10 mb-10">
          {/* <UBreadcrumbItem>
            <span
              class="cursor-pointer flex text-primary items-center u-label2"
              onClick={() => {
                this.$router.go(-1)
              }}
            >
              <ArrowLeftOutlined />
              <span class="ml-1">BACK</span>
            </span>
          </UBreadcrumbItem> */}
        </UBreadcrumb>
        <div class="flex mb-20 gap-6">
          <div class="basis-1/4">
            <Menu onRouterChange={handleRouterChange} />
          </div>
          <div class="basis-3/4">
            {this.currentEditComponent === 'INFO' && (
              <Info
                data={{
                  logo: this.startup?.logo || '',
                  cover: this.startup?.cover || '',
                  name: this.startup?.name || '',
                  mode: this.startup?.mode || 0,
                  mission: this.startup?.mission || '',
                  overview: this.startup?.overview || '',
                  blockChainAddress: this.startup?.blockChainAddress || '',
                  chainID: this.startup?.chainID,
                  hashTags: this.startup?.hashTags.map(e => e.name) || [],
                  isChain: this.startup?.onChain
                }}
                startupId={this.route.params.id as string}
              />
            )}
            {this.currentEditComponent === 'SECURITY' && (
              <Security
                data={{
                  kyc: this.startup?.kyc || '',
                  contractAudit: this.startup?.contractAudit || ''
                }}
                startupId={this.route.params.id as string}
              />
            )}
            {this.currentEditComponent === 'FINANCE' && (
              <Finance
                data={{
                  launchDate: this.startup?.launchDate || '',
                  presaleStart: this.startup?.presaleStart || '',
                  presaleEnd: this.startup?.presaleEnd || '',
                  tokenContractAddress: this.startup?.tokenContractAddress || '',
                  launchNetwork: this.startup?.launchNetwork || 0,
                  tokenName: this.startup?.tokenName || '',
                  tokenSymbol: this.startup?.tokenSymbol || '',
                  totalSupply: this.startup?.totalSupply || 0,
                  wallets: this.startup?.wallets || []
                }}
                startupId={this.route.params.id as string}
              />
            )}
            {this.currentEditComponent === 'TEAM' && (
              <Team
                startupId={this.startup?.id as unknown as string}
                founderId={this.startup?.comerID}
              />
            )}
            {this.currentEditComponent === 'SOCIAL' && (
              <Social
                data={{
                  tags: this.startup?.hashTags.map(e => e.name) || [],
                  socials: this.socialList
                }}
                startupId={this.route.params.id as string}
              />
            )}
            {this.currentEditComponent === 'GOVERNANCE' && this.startup && (
              <Governance startupId={this.route.params.id as string} startup={this.startup} />
            )}
            {this.currentEditComponent === 'SEQUENCE' && (
              <Sequence
                data={{ tabSequence: this.startup?.tabSequence || [] }}
                startupId={this.route.params.id as string}
              />
            )}
            {this.currentEditComponent === 'DAPP' && (
              <Dapp startupId={this.route.params.id as string} />
            )}
          </div>
        </div>
      </USpin>
    )
  }
})
