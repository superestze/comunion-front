import { ethers } from 'ethers'
import { defineStore } from 'pinia'
import { useRequest } from 'vue-request'
import { useBountyContract } from '@/contracts'
import { services } from '@/services'

export type BountyContractInfoType = {
  bountyStatus: number
  applicantCount: number
  depositBalance: number
  founderDepositAmount: number
  applicantDepositAmount: number
  applicantDepositMinAmount: number
  approvedStatus: number
  depositLock: boolean
  timeLock: number
  role: number
  myDepositAmount: number
  status: number
}

type GetFnReturnType<T> = T extends (...args: any) => infer U ? U : T

type BountyContract = GetFnReturnType<typeof useBountyContract>

type BountyContractType = {
  bountyContractInfo: BountyContractInfoType
}
let cancel: () => void
export const useBountyContractStore = defineStore('bountyContract', {
  state: (): BountyContractType => ({
    bountyContractInfo: {
      bountyStatus: 0,
      applicantCount: 0,
      depositBalance: 0,
      founderDepositAmount: 0,
      applicantDepositAmount: 0,
      applicantDepositMinAmount: 0,
      approvedStatus: 0,
      depositLock: false,
      timeLock: 0,
      role: 0,
      myDepositAmount: 0,
      status: 0
    }
  }),
  getters: {
    dontContract(state): boolean {
      return (
        state.bountyContractInfo.founderDepositAmount === 0 &&
        state.bountyContractInfo.myDepositAmount === 0
      )
    }
  },
  actions: {
    initialize(
      contract: BountyContract,
      bountyId: string,
      pollingInterval = false,
      interval = 5000,
      reset = false
    ) {
      const getState = () => {
        return new Promise((resolve, reject) => {
          if (reset) {
            this.bountyContractInfo = {
              bountyStatus: 0,
              applicantCount: 0,
              depositBalance: 0,
              founderDepositAmount: 0,
              applicantDepositAmount: 0,
              applicantDepositMinAmount: 0,
              approvedStatus: 0,
              depositLock: false,
              timeLock: 0,
              role: 0,
              myDepositAmount: 0,
              status: 0
            }
          }
          if (this.dontContract) {
            services['bounty@bounty-state']({ bountyID: bountyId }).then(response => {
              const { error, data } = response
              if (!error) {
                this.bountyContractInfo.applicantCount =
                  this.bountyContractInfo.applicantCount || data.applicantCount || 0
                this.bountyContractInfo.applicantDepositAmount =
                  this.bountyContractInfo.applicantDepositAmount || data.applicantDepositAmount || 0
                this.bountyContractInfo.approvedStatus =
                  this.bountyContractInfo.approvedStatus || data.approvedStatus || 0
                this.bountyContractInfo.applicantDepositMinAmount =
                  this.bountyContractInfo.applicantDepositMinAmount ||
                  data.applicantDepositMinAmount ||
                  0
                this.bountyContractInfo.bountyStatus =
                  this.bountyContractInfo.bountyStatus || data.bountyStatus || 0
                this.bountyContractInfo.depositBalance =
                  this.bountyContractInfo.depositBalance || data.depositBalance || 0
                this.bountyContractInfo.depositLock =
                  this.bountyContractInfo.depositLock || (data.depositLock as boolean)
                this.bountyContractInfo.founderDepositAmount =
                  this.bountyContractInfo.founderDepositAmount || data.founderDepositAmount || 0
                this.bountyContractInfo.myDepositAmount =
                  this.bountyContractInfo.myDepositAmount || data.myDepositAmount || 0
                this.bountyContractInfo.role = this.bountyContractInfo.role || data.myRole || 0
                this.bountyContractInfo.status =
                  this.bountyContractInfo.status || data.myStatus || 0
                this.bountyContractInfo.timeLock =
                  this.bountyContractInfo.timeLock || data.timeLock || 0
                // resolve(data)
              }
              // reject(error)
            })
            // return
          }
          // [
          //   /** _bountyStatus */ number,
          //   /** _applicantCount */ number | BigNumber,
          //   /** _depositBalance */ number | BigNumber,
          //   /** _founderDepositAmount */ number | BigNumber,
          //   /** _applicantDepositAmount */ number | BigNumber,
          //   /** _applicantDepositMinAmount */ number | BigNumber,
          //   /** _depositLock */ any,
          //   /** _timeLock */ number | BigNumber,
          //   /** _myRole */ number,
          //   /** _myDepositAmount */ number | BigNumber,
          //   /** _myStatus */ number
          // ]
          contract
            .state('', '')
            .then(response => {
              this.bountyContractInfo.bountyStatus = response[0]
              this.bountyContractInfo.applicantCount = Number(ethers.utils.formatEther(response[1]))
              this.bountyContractInfo.depositBalance = Number(ethers.utils.formatEther(response[2]))
              this.bountyContractInfo.founderDepositAmount = Number(
                ethers.utils.formatEther(response[3])
              )
              this.bountyContractInfo.applicantDepositAmount = Number(
                ethers.utils.formatEther(response[4])
              )
              this.bountyContractInfo.applicantDepositMinAmount = Number(
                ethers.utils.formatEther(response[5])
              )
              this.bountyContractInfo.depositLock = response[6]
              this.bountyContractInfo.timeLock = Number(ethers.utils.formatUnits(response[7], 0))
              this.bountyContractInfo.role = Number(response[8])
              this.bountyContractInfo.myDepositAmount = Number(
                ethers.utils.formatEther(response[9])
              )
              this.bountyContractInfo.status = Number(response[10])

              resolve(response)
              console.log(this.bountyContractInfo, Number(ethers.utils.formatUnits(response[7], 0)))
            })
            .catch(err => reject(err))
        })
      }
      if (pollingInterval) {
        if (cancel) {
          cancel()
        }
        const res = useRequest(getState, {
          pollingInterval: interval,
          pollingWhenHidden: true
        })
        cancel = res.cancel
      }
    }
  }
})
