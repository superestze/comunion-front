import { UMenu, MenuOption } from '@comunion/components'
import {
  InfoOutlined,
  SecurityOutlined,
  FinanceOutlined,
  TeamOutlined,
  SocialOutlined,
  GovernenceOutlined,
  SequenceOutlined,
  DappOutlined
} from '@comunion/icons'
import { defineComponent, h } from 'vue'

export default defineComponent({
  setup() {
    const menuOptions: MenuOption[] = [
      {
        label: () => h(<p>INFO</p>),
        key: 'INFO',
        icon: () => h(<InfoOutlined />)
      },
      {
        label: () => h(<p>SECURITY</p>),
        key: 'SECURITY',
        icon: () => h(<SecurityOutlined />)
      },
      {
        label: () => h(<p>FINANCE</p>),
        key: 'FINANCE',
        icon: () => h(<FinanceOutlined />)
      },
      {
        label: () => h(<p>TEAM</p>),
        key: 'TEAM',
        icon: () => h(<TeamOutlined />)
      },
      {
        label: () => h(<p>SOCIAL</p>),
        key: 'SOCIAL',
        icon: () => h(<SocialOutlined />)
      },
      {
        label: () => h(<p>GOVERNANCE</p>),
        key: 'GOVERNANCE',
        icon: () => h(<GovernenceOutlined />)
      },
      {
        label: () => h(<p>SEQUENCE</p>),
        key: 'SEQUENCE',
        icon: () => h(<SequenceOutlined />)
      },
      {
        label: () => h(<p>DAPP</p>),
        key: 'DAPP',
        icon: () => h(<DappOutlined />)
      }
    ]
    return {
      menuOptions
    }
  },
  emits: ['routerChange'],
  render() {
    const handleUpdateValue = (key: string, item: MenuOption) => {
      this.$emit('routerChange', { key, item })
      console.log(key, item)
    }
    return (
      <div class="bg-white rounded-lg border mb-6 relative overflow-hidden h-205.5">
        <p class="u-body2 m-6 text-grey3">Settings</p>
        <UMenu options={this.menuOptions} onUpdateValue={handleUpdateValue} />
      </div>
    )
  }
})
