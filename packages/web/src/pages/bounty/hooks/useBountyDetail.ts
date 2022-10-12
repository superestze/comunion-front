import { onUnmounted, ref } from 'vue'
import { ServiceReturn, services } from '@/services'

const loading = ref(false)
const detail = ref<ServiceReturn<'bounty@bounty-get-detail'> | null>(null)
const startup = ref<ServiceReturn<'bounty@bounty-startup-list'> | null>(null)
const founder = ref<ServiceReturn<'bounty@bounty-founder'> | null>(null)
const approvedPeople = ref<ServiceReturn<'bounty@bounty-approved'> | null>(null)
const activitiesList = ref<ServiceReturn<'bounty@bounty-activities-list'> | null>([])
const applicantsList = ref<ServiceReturn<'bounty@bounty-list-applicants'> | null>([])
const depositRecords = ref<ServiceReturn<'bounty@bounty-deposit-records'> | null>([])
const bountyPayment = ref<ServiceReturn<'bounty@bounty-payment'> | null>(null)

export default function useBountyDetail(bountyId: string | undefined) {
  async function get(id: string, reload = false) {
    if (reload) {
      detail.value = null
    }
    if (detail.value === null) {
      const { error, data } = await services['bounty@bounty-get-detail']({ bountyID: id })
      if (!error) {
        detail.value = data
      }
    }
    return detail.value
  }

  async function getStartup(bountyId: string, reload = false) {
    if (reload) {
      startup.value = null
    }
    if (startup.value === null) {
      const { error, data } = await services['bounty@bounty-startup-list']({ bountyID: bountyId })
      if (!error) {
        startup.value = data
      }
    }
    return startup.value
  }

  async function getFounder(bountyId: string, reload = false) {
    if (reload) {
      founder.value = null
    }
    if (founder.value === null) {
      const { error, data } = await services['bounty@bounty-founder']({ bountyID: bountyId })
      if (!error) {
        founder.value = data
      }
    }

    return founder.value
  }

  async function getApprovedPeople(bountyId: string, reload = false) {
    if (reload) {
      approvedPeople.value = null
    }
    if (approvedPeople.value === null) {
      const { error, data } = await services['bounty@bounty-approved']({ bountyID: bountyId })
      if (!error) {
        approvedPeople.value = data
      }
    }

    return approvedPeople.value
  }

  async function getActivities(bountyId: string, reload = false) {
    if (reload) {
      activitiesList.value = []
    }
    if (
      activitiesList.value === null ||
      (Array.isArray(activitiesList.value) && !activitiesList.value.length)
    ) {
      const { error, data } = await services['bounty@bounty-activities-list']({
        bountyID: bountyId
      })
      if (!error) {
        activitiesList.value = data
      }
    }

    return activitiesList.value
  }

  async function getApplicants(bountyId: string, reload = false) {
    if (reload) {
      applicantsList.value = []
    }
    if (
      applicantsList.value === null ||
      (Array.isArray(applicantsList.value) && !applicantsList.value.length)
    ) {
      const { error, data } = await services['bounty@bounty-list-applicants']({
        bountyID: bountyId
      })
      if (!error) {
        applicantsList.value = data
      }
    }

    return applicantsList.value
  }

  async function getDepositRecords(bountyId: string, reload = false) {
    if (reload) {
      depositRecords.value = []
    }
    if (
      depositRecords.value === null ||
      (Array.isArray(depositRecords.value) && !depositRecords.value.length)
    ) {
      const { error, data } = await services['bounty@bounty-deposit-records']({
        bountyID: bountyId
      })
      if (!error) {
        depositRecords.value = data
      }
    }

    return depositRecords.value
  }

  async function getBountyPayment(bountyId: string, reload = false) {
    if (reload) {
      bountyPayment.value = null
    }
    if (bountyPayment.value === null) {
      const { error, data } = await services['bounty@bounty-payment']({
        bountyID: bountyId
      })
      if (!error) {
        bountyPayment.value = data
      }
    }

    return bountyPayment.value
  }

  function initialize(bountyId: string, reload = false) {
    if (loading.value) {
      return console.warn('useBountyDetail is loading')
    }
    loading.value = true
    Promise.all([
      get(bountyId, reload),
      getStartup(bountyId, reload),
      getFounder(bountyId, reload),
      getApprovedPeople(bountyId, reload),
      getActivities(bountyId, reload),
      getApplicants(bountyId, reload),
      getBountyPayment(bountyId, reload),
      getDepositRecords(bountyId, reload)
    ]).finally(() => {
      loading.value = false
    })
  }

  function reload() {
    bountyId && initialize(bountyId, true)
  }

  bountyId && initialize(bountyId)

  onUnmounted(() => {
    detail.value = null
    startup.value = null
    founder.value = null
    approvedPeople.value = null
    activitiesList.value = []
    applicantsList.value = []
    depositRecords.value = []
    bountyPayment.value = null
  })

  return {
    detail,
    startup,
    founder,
    approvedPeople,
    activitiesList,
    applicantsList,
    depositRecords,
    bountyPayment,
    get,
    getStartup,
    getFounder,
    getApprovedPeople,
    getActivities,
    getApplicants,
    getBountyPayment,
    getDepositRecords,
    reload
  }
}
