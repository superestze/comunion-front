import { MenuOption, UBreadcrumb, UBreadcrumbItem, USpin } from '@comunion/components'
import { ArrowLeftOutlined } from '@comunion/icons'
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStartup } from '../hooks/useStartup'
import Dapp from './components/dapp'
import Finance from './components/finance'
import Governance from './components/governance'
import Info from './components/info'
import Menu from './components/menu'
import Security from './components/security'
import Sequence from './components/sequence'
import Social from './components/social'
import { contactList } from './components/social/util'
import { Team } from './components/team'

export default defineComponent({
  setup() {
    const loading = ref<boolean>(false)
    const currentEditComponent = ref<string>('INFO')
    const startup = useStartup()
    const route = useRoute()
    startup.get(route.params.id as string)

    const getContactList = (startupInfo: { [x: string]: any }) => {
      return contactList
        .map(item => {
          const value = startupInfo[item.name]
          return {
            socialType: value ? item.value : 0,
            socialLink: value
          }
        })
        .filter(e => e.socialType !== 0)
    }

    return {
      loading,
      currentEditComponent,
      startup: startup.detail,
      route,
      getContactList
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
          <UBreadcrumbItem v-slots={{ separator: () => <ArrowLeftOutlined /> }}></UBreadcrumbItem>
          <UBreadcrumbItem v-slots={{ separator: () => <ArrowLeftOutlined /> }}>
            <span
              class="cursor-pointer text-primary uppercase u-label2"
              onClick={() => {
                this.$router.go(-1)
              }}
            >
              BACK
            </span>
          </UBreadcrumbItem>
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
                  blockChainAddress: this.startup?.blockChainAddress || ''
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
                  socials: this.getContactList(this.startup || {})
                }}
                startupId={this.route.params.id as string}
              />
            )}
            {this.currentEditComponent === 'GOVERNANCE' && (
              <Governance startupId={this.route.params.id as string} />
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
