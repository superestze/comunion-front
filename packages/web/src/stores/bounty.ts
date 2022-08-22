import { defineStore } from 'pinia'
import { ServiceReturn, services } from '@/services'

export type BountyState = {
  detail: ServiceReturn<'bounty@bounty-get-detail'> | null
  startup: ServiceReturn<'bounty@bounty-startup-list'> | null
  founder: ServiceReturn<'bounty@bounty-founder'> | null
  approvedPeople: ServiceReturn<'bounty@bounty-approved'> | null
  activitiesList: ServiceReturn<'bounty@bounty-activities-list'> | []
  applicantsList: ServiceReturn<'bounty@bounty-list-applicants'> | []
  depositRecords: ServiceReturn<'bounty@bounty-deposit-records'> | []
  bountyPayment: ServiceReturn<'bounty@bounty-payment'> | null
}

export const useBountyStore = defineStore('bounty', {
  state: (): BountyState => ({
    detail: null,
    startup: null,
    founder: null,
    approvedPeople: null,
    activitiesList: [],
    applicantsList: [],
    depositRecords: [],
    bountyPayment: null
  }),
  getters: {
    bountySection(state): BountyState {
      return {
        detail: state.detail,
        startup: state.startup,
        founder: state.founder,
        approvedPeople: state.approvedPeople,
        activitiesList: state.activitiesList,
        applicantsList: state.applicantsList,
        depositRecords: state.depositRecords,
        bountyPayment: state.bountyPayment
      }
    }
  },
  actions: {
    initialize(bountyId: string) {
      const list = [
        this.get(bountyId),
        this.getStartup(bountyId),
        this.getFounder(bountyId),
        this.getApprovedPeople(bountyId),
        this.getActivities(bountyId),
        this.getApplicants(bountyId),
        this.getBountyPayment(bountyId),
        this.getDepositRecords(bountyId)
      ]
      return Promise.all(list)
    },
    async get(id: string) {
      const { error, data } = await services['bounty@bounty-get-detail']({ bountyID: id })
      if (!error) {
        this.detail = data
        return data
      }
      return
    },
    async getStartup(bountyId: string) {
      const { error, data } = await services['bounty@bounty-startup-list']({ bountyID: bountyId })
      if (!error) {
        this.startup = data
        return data
      }
      return
    },
    async getFounder(bountyId: string) {
      const { error, data } = await services['bounty@bounty-founder']({ bountyID: bountyId })
      if (!error) {
        this.founder = data
        return data
      }
      return
    },
    async getApprovedPeople(bountyId: string) {
      const { error, data } = await services['bounty@bounty-approved']({ bountyID: bountyId })
      if (!error) {
        this.approvedPeople = data
        return data
      }
      return
    },
    async getActivities(bountyId: string) {
      const { error, data } = await services['bounty@bounty-activities-list']({
        bountyID: bountyId
      })
      if (!error) {
        this.activitiesList = data
        return data
      }
      return
    },
    async getApplicants(bountyId: string) {
      const { error, data } = await services['bounty@bounty-list-applicants']({
        bountyID: bountyId
      })
      if (!error) {
        this.applicantsList = data
        return data
      }
      return
    },
    async getDepositRecords(bountyId: string) {
      const { error, data } = await services['bounty@bounty-deposit-records']({
        bountyID: bountyId
      })
      if (!error) {
        this.depositRecords = data
        return data
      }
      return
    },
    async getBountyPayment(bountyId: string) {
      const { error, data } = await services['bounty@bounty-payment']({
        bountyID: bountyId
      })
      if (!error) {
        this.bountyPayment = data
        return data
      }
      return
    }
  }
})
