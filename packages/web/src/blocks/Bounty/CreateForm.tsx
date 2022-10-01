import './style.css'
import { UButton, UCard, UModal, UTabPane, UTabs } from '@comunion/components'
import { PeriodOutlined, StageOutlined, WarningFilled } from '@comunion/icons'
import dayjs from 'dayjs'

import { Contract, ethers } from 'ethers'
import { defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import BountyBasicInfo, { BountyBasicInfoRef, MAX_AMOUNT } from './components/BasicInfo'
import Deposit from './components/Deposit'
import PayDetailPeriod, { PayDetailPeriodRef } from './components/PayDetailPeriod'
import PayDetailStage, { PayDetailStageRef } from './components/PayDetailStage'
import { BountyInfo, chainInfoType } from './typing'
import { getBuyCoinAddress } from '@/blocks/Crowdfunding/utils'
import Steps from '@/components/Step'
import { useBountyFactoryContract, useErc20Contract } from '@/contracts'
import { BountyFactoryAddresses as bountyFactoryAddresses } from '@/contracts/bountyFactory'
import { AVAX_USDC_ADDR } from '@/contracts/utils'
import { services } from '@/services'
import { useUserStore, useWalletStore } from '@/stores'
import { useContractStore } from '@/stores/contract'
import { reportError } from '@/utils/sentry'

const CreateBountyForm = defineComponent({
  name: 'CreateBountyForm',
  emits: ['cancel'],
  setup(props, ctx) {
    const walletStore = useWalletStore()
    const userStore = useUserStore()
    const usdcTokenContract = useErc20Contract()
    const contractStore = useContractStore()
    const stepOptions = ref([{ name: 'Bounty' }, { name: 'Payment' }, { name: 'Deposit' }])

    const bountyContract = useBountyFactoryContract()
    const modalVisibleState = ref(false)
    const modalClickYesToWhere = ref('')
    const router = useRouter()
    const bountyBasicInfoRef = ref<BountyBasicInfoRef>()
    const payPeriodRef = ref<PayDetailPeriodRef>()
    const payStageRef = ref<PayDetailStageRef>()
    const chainInfo = ref<chainInfoType>({
      chainID: undefined,
      onChain: false
    })
    const tokens = getBuyCoinAddress('0x0')
    const token1Symbol = tokens[walletStore.chainId!][1].label || 'USDC'
    const bountyInfoRef = ref<BountyInfo>({
      current: 1,
      startupID: undefined,
      title: '',
      expiresIn: undefined,
      contact: [{ type: 1, value: '' }],
      discussionLink: '',
      applicantsSkills: [],
      applicantsDeposit: 0,
      description: '',
      payDetailType: 'stage',
      token1Symbol: token1Symbol,
      token2Symbol: '',
      payTokenSymbol: '',
      stages: [{ token1Amount: 0, token2Amount: 0, terms: '' }],
      period: {
        periodType: 2,
        periodAmount: 2,
        hoursPerDay: 1,
        target: '',
        token1Amount: 0,
        token2Amount: 0
      },
      deposit: 0,
      agreement: false,
      onChain: false
    })
    const bountyInfo = bountyInfoRef.value
    const addContact = () => {
      bountyInfo.contact.push({ type: 1, value: '' })
    }

    const delContact = (index: number) => {
      bountyInfo.contact.splice(index, 1)
    }

    const renderUnit = (name: string) => (
      <div class="bg-white border rounded-r-lg flex px-10 w-30 justify-center items-center">
        {name}
      </div>
    )

    const addStage = () => {
      bountyInfo.stages.push({ token1Amount: 0, token2Amount: 0, terms: '' })
    }

    const delStage = (stageIndex: number) => {
      bountyInfo.stages.splice(stageIndex, 1)
    }

    const toFinanceSetting = () => {
      closeDrawer()
      const url = `/financesetting?startupId=${bountyInfo.startupID}`
      router.push(url)
    }

    const showLeaveTipModal = (toNext = '') => {
      modalClickYesToWhere.value = toNext
      modalVisibleState.value = true
    }

    const contractSubmit = async () => {
      const approvePendingText = 'Create bounty deposit contract on blockchain.'
      const value = bountyInfo.deposit
      const applicantsDeposit = bountyInfo.applicantsDeposit

      try {
        /* first approve amount to bountyFactory */
        const usdcTokenAddress = AVAX_USDC_ADDR[walletStore.chainId!] // get usdc contract address
        const usdcRes = await usdcTokenContract(usdcTokenAddress) // construct erc20 contract
        const decimal = await usdcRes.decimals()
        const bountyAmount = ethers.utils.parseUnits(value.toString(), decimal) // convert usdc unit to wei
        const applicantsDepositAmount = ethers.utils.parseUnits(
          applicantsDeposit.toString(),
          decimal
        ) // convert usdc unit to wei
        if (value !== 0) {
          contractStore.startContract(approvePendingText)
          const bountyFactoryAddress = bountyFactoryAddresses()
          // approve amount to bounty factory contract
          const approveRes: Contract = await usdcRes.approve(bountyFactoryAddress, bountyAmount)
          await approveRes.wait()
        }
        // second send tx to bountyFactory create bounty
        const contractRes: any = await bountyContract.createBounty(
          usdcTokenAddress,
          bountyAmount,
          applicantsDepositAmount,
          dayjs(bountyInfo.expiresIn).utc().valueOf() / 1000,
          'Create bounty deposit contract on blockchain.',
          `<div class="flex items-center">Bounty "<span class="max-w-20 truncate">${bountyInfo.title}</span>" is creating</div>`
        )
        return contractRes
      } catch (e: any) {
        reportError(e as Error)
        console.error(e)
        contractStore.endContract('failed', { success: false })
      }
      return null
    }

    const postSubmit = async () => {
      try {
        const contractRes = await contractSubmit()
        if (!contractRes) return
        const payDetail = (() => {
          if (bountyInfo.payDetailType === 'stage') {
            return {
              stages: bountyInfo.stages.map((stage, stageIndex) => {
                const token1Amount = Number(stage.token1Amount)
                const token2Amount = Number(bountyInfo.token2Symbol ? stage.token2Amount : 0)
                return {
                  seqNum: stageIndex + 1,
                  token1Amount: token1Amount || 0, // usdc amount
                  token1Symbol: bountyInfo.payTokenSymbol, // usdc symbol
                  token2Amount: token2Amount || 0, // finance setting token amount
                  token2Symbol: bountyInfo.token2Symbol, // finance setting token symbol
                  terms: stage.terms
                }
              })
            }
          } else {
            const periodAmount = Number(bountyInfo.period.periodAmount)
            const token1Amount = Number(bountyInfo.period.token1Amount)
            const token2Amount = Number(bountyInfo.period.token2Amount)
            const hoursPerDay = Number(bountyInfo.period.hoursPerDay)
            return {
              period: {
                periodAmount: periodAmount || 0,
                periodType: bountyInfo.period.periodType,
                hoursPerDay: hoursPerDay || 0,
                token1Amount: token1Amount || 0, // usdc amount
                token1Symbol: bountyInfo.payTokenSymbol, // usdc symbol
                token2Amount: token2Amount || 0, // finance setting token amount
                token2Symbol: bountyInfo.token2Symbol, // finance setting token symbol
                target: bountyInfo.period.target
              }
            }
          }
        })()
        // bountyInfo.payDetailType === 'stage'
        //   ? {
        //       stages: bountyInfo.stages.map((stage, stageIndex) => {
        //         const token1Amount = Number(stage.token1Amount)
        //         const token2Amount = Number(bountyInfo.token2Symbol ? stage.token2Amount : 0)
        //         return {
        //           seqNum: stageIndex + 1,
        //           token1Amount: token1Amount || 0, // usdc amount
        //           token1Symbol: bountyInfo.token1Symbol, // usdc symbol
        //           token2Amount: token2Amount || 0, // finance setting token amount
        //           token2Symbol: bountyInfo.token2Symbol, // finance setting token symbol
        //           terms: stage.terms
        //         }
        //       })
        //     }
        //   : {
        //       period: {
        //         periodAmount: Number(bountyInfo.period.periodAmount),
        //         periodType: bountyInfo.period.periodType,
        //         hoursPerDay: bountyInfo.period.hoursPerDay,
        //         token1Amount: Number(bountyInfo.period.token1Amount), // usdc amount
        //         token1Symbol: bountyInfo.token1Symbol, // usdc symbol
        //         token2Amount: Number(bountyInfo.period.token2Amount), // finance setting token amount
        //         token2Symbol: bountyInfo.token2Symbol, // finance setting token symbol
        //         target: bountyInfo.period.target
        //       }
        //     }
        await services['bounty@bounty-create']({
          bountyDetail: {
            startupID: bountyInfo.startupID as number,
            comerID: userStore.profile?.comerID,
            title: bountyInfo.title,
            expiresIn: dayjs(bountyInfo.expiresIn).utc().format('YYYY-MM-DD HH:mm:ss'),
            contact: bountyInfo.contact
              .filter(item => item.value)
              .map(item => ({ contactType: item.type, contactAddress: item.value })),
            discussionLink: bountyInfo.discussionLink,
            applicantsSkills: bountyInfo.applicantsSkills,
            applicantsDeposit: Number(bountyInfo.applicantsDeposit),
            description: bountyInfo.description
          },
          payDetail,
          deposit: {
            tokenSymbol: bountyInfo.token1Symbol,
            tokenAmount: +Number(bountyInfo.deposit)
          },
          chainInfo: {
            chainID: walletStore.chainId,
            txHash: contractRes.hash
          }
        })
        ctx.emit('cancel')
      } catch (error) {
        reportError(error as Error)
        console.error('error===>', error)
      }
    }

    const closeDrawer = () => {
      modalVisibleState.value = false
      ctx.emit('cancel')
    }

    const onSubmit = async () => {
      // const value = new Big(bountyInfo.deposit).times(Math.pow(10, 18)).toNumber
      postSubmit()
    }
    const getFinanceSymbol = async (startupId?: number) => {
      if (!startupId) {
        bountyInfo.token2Symbol = ''
        return
      }
      const { error, data } = await services['startup@startup-get']({
        startupId
      })
      if (!error) {
        bountyInfo.token2Symbol = data.tokenSymbol
        netWorkChange(data.chainID)
        chainInfo.value = { chainID: data.chainID, onChain: data.onChain }
      }
    }
    const netWorkChange = async (value: number) => {
      if (walletStore.chainId !== value) {
        await walletStore.ensureWalletConnected()
        const result = await walletStore.wallet?.switchNetwork(value)
        if (!result) {
          closeDrawer()
        }
      }
    }
    watch(
      () => bountyInfo.startupID,
      () => {
        getFinanceSymbol(bountyInfo.startupID)
      }
    )
    const toNext = () => {
      if (bountyInfo.current === 1) {
        bountyBasicInfoRef.value?.bountyDetailForm?.validate(error => {
          if (!error) {
            bountyInfo.current += 1
          }
        })
      } else if (bountyInfo.current === 2 && bountyInfo.payDetailType === 'stage') {
        // if anyone total rewards bigger than MAX_AMOUNT, go to next is not allowed
        if (
          (payStageRef.value?.payStagesTotal.usdcTotal as number) > MAX_AMOUNT ||
          (payStageRef.value?.payStagesTotal?.tokenTotal as number) > MAX_AMOUNT
        ) {
          return
        }
        payStageRef.value?.payStageForm?.validate(error => {
          if (!error) {
            bountyInfo.current += 1
          }
        })
      } else if (bountyInfo.current === 2 && bountyInfo.payDetailType === 'period') {
        if (
          (payPeriodRef.value?.payPeriodTotal.usdcTotal as number) > MAX_AMOUNT ||
          (payPeriodRef.value?.payPeriodTotal?.tokenTotal as number) > MAX_AMOUNT
        ) {
          return
        }
        payPeriodRef.value?.payPeriodForm?.validate(error => {
          if (!error) {
            bountyInfo.current += 1
          }
        })
      }
    }

    const toPreviousStep = () => {
      bountyInfo.current -= 1
    }

    ctx.expose({
      bountyInfo,
      toNext,
      toPreviousStep,
      onSubmit,
      showLeaveTipModal
    })

    bountyInfo.payTokenSymbol = bountyInfo.payTokenSymbol || bountyInfo.token1Symbol
    return {
      stepOptions,
      bountyInfo,
      modalVisibleState,
      bountyBasicInfoRef,
      payPeriodRef,
      payStageRef,
      addContact,
      delContact,
      toFinanceSetting,
      renderUnit,
      delStage,
      addStage,
      showLeaveTipModal,
      closeDrawer,
      modalClickYesToWhere,
      chainInfo
    }
  },

  render() {
    return (
      <>
        <div class="mx-35 mb-15">
          <Steps
            steps={this.stepOptions}
            current={this.bountyInfo.current}
            classes={{ stepTitle: 'whitespace-nowrap' }}
          />
        </div>
        {this.bountyInfo.current === 1 && (
          <BountyBasicInfo
            bountyInfo={this.bountyInfo}
            chainInfo={this.chainInfo}
            onDelContact={this.delContact}
            onAddContact={this.addContact}
            onCloseDrawer={this.closeDrawer}
            ref={(ref: any) => (this.bountyBasicInfoRef = ref)}
          />
        )}
        {this.bountyInfo.current === 2 && (
          <UTabs v-model:value={this.bountyInfo.payDetailType} class="mt-10">
            <UTabPane
              name="stage"
              v-slots={{
                tab: () => (
                  <div class="flex items-center">
                    <StageOutlined class="mr-4" /> Stage
                  </div>
                )
              }}
            >
              <PayDetailStage
                ref={(ref: any) => (this.payStageRef = ref)}
                bountyInfo={this.bountyInfo}
                chainInfo={this.chainInfo}
                onDelStage={this.delStage}
                onAddStage={this.addStage}
                onShowLeaveTipModal={this.showLeaveTipModal}
              />
            </UTabPane>
            <UTabPane
              name="period"
              v-slots={{
                tab: () => (
                  <div class="flex items-center">
                    <PeriodOutlined class="mr-4" />
                    Period
                  </div>
                )
              }}
            >
              <PayDetailPeriod
                bountyInfo={this.bountyInfo}
                chainInfo={this.chainInfo}
                ref={(ref: any) => (this.payPeriodRef = ref)}
                onShowLeaveTipModal={this.showLeaveTipModal}
              />
            </UTabPane>
          </UTabs>
        )}
        {this.bountyInfo.current === 3 && <Deposit bountyInfo={this.bountyInfo} />}
        {/* {this.visible && <CreateStartupForm onCancel={this.close} />} */}
        {/* {this.footer()} */}
        <UModal v-model:show={this.modalVisibleState} maskClosable={false}>
          <UCard
            style={{ width: '540px' }}
            closable={true}
            onClose={() => (this.modalVisibleState = false)}
            v-slots={{
              header: () => {
                return (
                  <div class="flex relative items-center">
                    <WarningFilled class="mr-4" />{' '}
                    <span class="text-color1 u-h3">Discard the changes?</span>
                  </div>
                )
              }
            }}
          >
            <div class="min-h-20 p-4 text-color2 u-h6">
              Note: The action cannot be undone at once you click 'Yes'!
            </div>
            <div class="flex mt-4 justify-end">
              <UButton
                size="large"
                type="primary"
                ghost
                class="mr-4 w-41"
                onClick={() => (this.modalVisibleState = false)}
              >
                Cancel
              </UButton>
              <UButton
                size="large"
                type="primary"
                class="w-41"
                onClick={
                  this.modalClickYesToWhere === 'toFinanceSetting'
                    ? this.toFinanceSetting
                    : this.closeDrawer
                }
              >
                Yes
              </UButton>
            </div>
          </UCard>
        </UModal>
      </>
    )
  }
})

export default CreateBountyForm
