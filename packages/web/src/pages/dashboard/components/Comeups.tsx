import { UCard, UTabPane, UTabs } from '@comunion/components'
import { defineComponent, onMounted, ref } from 'vue'
import styles from './Shared.module.css'
import { ServiceReturn, services } from '@/services'

interface startupParams {
  limit: any
  offset: any
  keyword: any
  /**
   * @description NONE,ESG,NGO,DAO,COM
   */
  mode: any
}

const Comeups = defineComponent({
  name: 'Comeups',
  setup(prop, ctx) {
    const myStartupPages = {
      limit: 4,
      offset: 0,
      keyword: '',
      mode: ''
    }

    const myJoinStartupPages = {
      limit: 4,
      offset: 0,
      keyword: '',
      mode: ''
    }
    const myCreatedStartups = ref<ServiceReturn<'startup@startup-list-me'>>()
    const myJoinStartups = ref<ServiceReturn<'startup@startup-list-followed'>>()
    onMounted(async () => {
      getCreatedStartups(myStartupPages)
      getMyJoinStartups(myJoinStartupPages)
    })

    const getCreatedStartups = async (params: startupParams) => {
      const { error, data } = await services['startup@startup-list-followed'](params)
      if (!error) {
        myCreatedStartups.value = data
      }
    }

    const getMyJoinStartups = async (params: startupParams) => {
      const { error, data } = await services['startup@startup-list-me'](params)
      if (!error) {
        myJoinStartups.value = data
      }
    }

    return () => (
      <UCard title="MY COMEUPS" size="small" class={styles.cardTitle}>
        <UTabs>
          <UTabPane name="WHAT I PARTICIPATED" tab="WHAT I PARTICIPATED">
            {' '}
          </UTabPane>
          <UTabPane name="INITIATED BY ME" tab="INITIATED BY ME">
            {' '}
          </UTabPane>
        </UTabs>
      </UCard>
    )
  }
})

export default Comeups
