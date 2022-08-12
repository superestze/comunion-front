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
import { Team } from './components/team'

export default defineComponent({
  setup() {
    const loading = ref<boolean>(false)
    const currentEditComponent = ref<string>('INFO')
    const startup = useStartup()
    const route = useRoute()
    startup.get(route.params.id as string)
    return {
      loading,
      currentEditComponent,
      startup: startup.detail
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
        <div class="flex gap-6 mb-20">
          <div class="basis-1/4">
            <Menu onRouterChange={handleRouterChange} />
          </div>
          <div class="basis-3/4">
            {this.currentEditComponent === 'INFO' && (
              <Info
                data={{
                  logo: this.startup?.logo || '',
                  name: this.startup?.name || '',
                  mode: this.startup?.mode || 0,
                  mission: this.startup?.mission || '',
                  overview: this.startup?.overview || '',
                  blockChainAddress: this.startup?.blockChainAddress || ''
                }}
              />
            )}
            {this.currentEditComponent === 'SECURITY' && (
              <Security
                data={{
                  kyc: this.startup?.kyc || '',
                  contractAudit: this.startup?.contractAudit || ''
                }}
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
              />
            )}
            {this.currentEditComponent === 'TEAM' && (
              <Team startupId={this.startup?.id as unknown as string} />
            )}
            {this.currentEditComponent === 'SOCIAL' && (
              <h1>Ready</h1>
              // <Social
              //   data={
              //     {
              //       tags: this.startup?.hashTags
              //       contacts: this.startup.con
              //     }
              //   }
              // />
            )}
            {this.currentEditComponent === 'GOVERNANCE' && <Governance />}
            {this.currentEditComponent === 'SEQUENCE' && <Sequence />}
            {this.currentEditComponent === 'DAPP' && <Dapp />}
          </div>
        </div>
      </USpin>
    )
  }
})
