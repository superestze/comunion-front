import { onMounted, ref } from 'vue'
import { ServiceReturn, services } from '@/services'

export default function useBountyDetail(bountyId: string) {
  const detail = ref<ServiceReturn<'bounty@bounty-get-detail'> | null>(null)
  const startup = ref<ServiceReturn<'bounty@bounty-startup-list'> | null>(null)
  const founder = ref<ServiceReturn<'bounty@bounty-founder'> | null>(null)
  const approvedPeople = ref<ServiceReturn<'bounty@bounty-approved'> | null>(null)
  const activitiesList = ref<ServiceReturn<'bounty@bounty-activities-list'> | null>([])
  const applicantsList = ref<ServiceReturn<'bounty@bounty-list-applicants'> | null>([])
  const depositRecords = ref<ServiceReturn<'bounty@bounty-deposit-records'> | null>([])
  const bountyPayment = ref<ServiceReturn<'bounty@bounty-payment'> | null>(null)

  async function get(id: string) {
    if (detail.value === null) {
      const { error, data } = await services['bounty@bounty-get-detail']({ bountyID: id })
      if (!error) {
        detail.value = data
      }
    }
    return detail.value
  }

  async function getStartup(bountyId: string) {
    if (startup.value === null) {
      const { error, data } = await services['bounty@bounty-startup-list']({ bountyID: bountyId })
      if (!error) {
        startup.value = data
      }
    }
    return startup.value
  }

  async function getFounder(bountyId: string) {
    if (founder.value === null) {
      const { error, data } = await services['bounty@bounty-founder']({ bountyID: bountyId })
      if (!error) {
        founder.value = data
      }
    }

    return founder.value
  }

  async function getApprovedPeople(bountyId: string) {
    if (approvedPeople.value === null) {
      const { error, data } = await services['bounty@bounty-approved']({ bountyID: bountyId })
      if (!error) {
        approvedPeople.value = data
      }
    }

    return approvedPeople.value
  }

  async function getActivities(bountyId: string) {
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

  async function getApplicants(bountyId: string) {
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

  async function getDepositRecords(bountyId: string) {
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

  async function getBountyPayment(bountyId: string) {
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

  function initialize(bountyId: string) {
    return Promise.all([
      get(bountyId),
      getStartup(bountyId),
      getFounder(bountyId),
      getApprovedPeople(bountyId),
      getActivities(bountyId),
      getApplicants(bountyId),
      getBountyPayment(bountyId),
      getDepositRecords(bountyId)
    ])
  }

  onMounted(() => {
    initialize(bountyId)
  })

  return {
    detail,
    startup,
    founder,
    approvedPeople,
    activitiesList,
    applicantsList,
    depositRecords,
    bountyPayment
  }
}
