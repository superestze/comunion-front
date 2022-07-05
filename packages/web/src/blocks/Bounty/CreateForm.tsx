import './style.css'
import { UButton, UCard, UModal, UTabPane, UTabs, message } from '@comunion/components'
import { PeriodOutlined, StageOutlined, WarningFilled } from '@comunion/icons'
import dayjs from 'dayjs'

import { BigNumber, Contract } from 'ethers'
import { defineComponent, ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import BountyBasicInfo, { BountyBasicInfoRef, MAX_AMOUNT } from './components/BasicInfo'
import Deposit from './components/Deposit'
import PayDetailPeriod, { PayDetailPeriodRef } from './components/PayDetailPeriod'
import PayDetailStage, { PayDetailStageRef } from './components/PayDetailStage'
import { BountyInfo } from './typing'
import Steps from '@/components/Step'
import { useBountyContract, useErc20Contract } from '@/contracts'
import { addresses as bountyAddresses } from '@/contracts/bounty'
import { AVAX_USDC_ADDR } from '@/contracts/utils'
import { services } from '@/services'
import { useUserStore, useWalletStore } from '@/stores'
import { useContractStore } from '@/stores/contract'

const CreateBountyForm = defineComponent({
  name: 'CreateBountyForm',
  emits: ['cancel'],
  setup(props, ctx) {
    const walletStore = useWalletStore()
    const userStore = useUserStore()
    const usdcTokenContract = useErc20Contract(true)
    const contractStore = useContractStore()
    const stepOptions = ref([{ name: 'Bounty' }, { name: 'Payment' }, { name: 'Deposit' }])

    const bountyContract = useBountyContract()
    const modalVisibleState = ref(false)
    const router = useRouter()
    const bountyBasicInfoRef = ref<BountyBasicInfoRef>()
    const payPeriodRef = ref<PayDetailPeriodRef>()
    const payStageRef = ref<PayDetailStageRef>()
    const bountyInfo = reactive<BountyInfo>({
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
      token1Symbol: 'USDC',
      token2Symbol: '',
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
      agreement: false
    })

    const addContact = () => {
      bountyInfo.contact.push({ type: 1, value: '' })
    }

    const delContact = (index: number) => {
      bountyInfo.contact.splice(index, 1)
    }

    const renderUnit = (name: string) => (
      <div class="flex justify-center items-center border rounded-r-lg px-10 bg-white w-30">
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
      ctx.emit('cancel')
      modalVisibleState.value = false
      const url = `/financesetting?startupId=${bountyInfo.startupID}`
      router.push(url)
    }

    const showLeaveTipModal = () => {
      modalVisibleState.value = true
    }

    const contractSubmit = async () => {
      const approvePendingText = 'Waiting to submit all contents to blockchain for approval deposit'
      const value = bountyInfo.deposit
      const usdcTokenAddress = AVAX_USDC_ADDR[walletStore.chainId!]
      const bountyFactoryAddress = bountyAddresses[walletStore.chainId!]
      const usdcRes = await usdcTokenContract(usdcTokenAddress)
      const decimal = await usdcRes.decimals()
      const bountyAmount = BigNumber.from(value).mul(BigNumber.from(10).pow(decimal))
      // first approve amount to bountyFactory
      try {
        contractStore.startContract(approvePendingText)
        const approveRes: Contract = await usdcRes.approve(bountyFactoryAddress, bountyAmount)
        await contractStore.endContract('success', {
          success: true,
          hash: approveRes.hash,
          text: approvePendingText,
          promiseFn: approveRes.wait
        })
        // second send tx to bountyFactory create bounty
        const contractRes: any = await bountyContract.createBounty(
          bountyAmount,
          'Waiting to submit all contents to blockchain for creating bounty',
          <div class="flex items-center">
            Bounty "<span class="truncate max-w-20">{bountyInfo.title}</span>" is Creating
          </div>
        )
        return contractRes
      } catch (e: any) {
        console.error(e)
        contractStore.endContract('failed', { success: false })
        if (e.data?.message) {
          message.error(e.data.message)
        }
      }
      return null
    }

    const postSubmit = async () => {
      try {
        const contractRes = await contractSubmit()
        if (!contractRes) return
        const payDetail =
          bountyInfo.payDetailType === 'stage'
            ? {
                stages: bountyInfo.stages.map((stage, stageIndex) => ({
                  seqNum: stageIndex + 1,
                  token1Amount: stage.token1Amount, // usdc amount
                  token1Symbol: bountyInfo.token1Symbol, // usdc symbol
                  token2Amount: bountyInfo.token2Symbol ? stage.token2Amount : 0, // finance setting token amount
                  token2Symbol: bountyInfo.token2Symbol, // finance setting token symbol
                  terms: stage.terms
                }))
              }
            : {
                period: {
                  periodAmount: bountyInfo.period.periodAmount,
                  periodType: bountyInfo.period.periodType,
                  hoursPerDay: bountyInfo.period.hoursPerDay,
                  token1Amount: bountyInfo.period.token1Amount, // usdc amount
                  token1Symbol: bountyInfo.token1Symbol, // usdc symbol
                  token2Amount: bountyInfo.period.token2Amount, // finance setting token amount
                  token2Symbol: bountyInfo.token2Symbol, // finance setting token symbol
                  target: bountyInfo.period.target
                }
              }
        await services['bounty@bounty-create']({
          bountyDetail: {
            startupID: bountyInfo.startupID as number,
            comerID: userStore.profile?.comerID,
            title: bountyInfo.title,
            expiresIn: dayjs(bountyInfo.expiresIn).format('YYYY-MM-DD HH:mm:ss'),
            contact: bountyInfo.contact
              .filter(item => item.value)
              .map(item => ({ contactType: item.type, contactAddress: item.value })),
            discussionLink: bountyInfo.discussionLink,
            applicantsSkills: bountyInfo.applicantsSkills,
            applicantsDeposit: bountyInfo.applicantsDeposit,
            description: bountyInfo.description
          },
          payDetail,
          deposit: {
            tokenSymbol: bountyInfo.token1Symbol,
            tokenAmount: bountyInfo.deposit
          },
          chainInfo: {
            chainID: walletStore.chainId,
            txHash: contractRes.hash
          }
        })
        ctx.emit('cancel')
      } catch (error) {
        console.error('error===>', error)
      }
    }

    const closeDrawer = () => {
      modalVisibleState.value = false
      ctx.emit('cancel')
    }

    const onSubmit = async () => {
      // const value = new Big(bountyInfo.deposit).times(Math.pow(10, 18)).toNumber()
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
      }
    }

    watch(
      () => bountyInfo.startupID,
      () => {
        getFinanceSymbol(bountyInfo.startupID)
      }
    )

    const toNext = () => {
      console.log('bountyInfo===>', payStageRef.value?.payStageForm)

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
      closeDrawer
    }
  },

  render() {
    return (
      <div>
        <div class="mb-15 mx-35">
          <Steps steps={this.stepOptions} current={this.bountyInfo.current} />
        </div>
        {this.bountyInfo.current === 1 && (
          <BountyBasicInfo
            bountyInfo={this.bountyInfo}
            onDelContact={this.delContact}
            onAddContact={this.addContact}
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
                ref={(ref: any) => (this.payPeriodRef = ref)}
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
            class="!p-7"
            onClose={() => (this.modalVisibleState = false)}
          >
            <div class="relative -top-3 flex items-center">
              <WarningFilled /> <span class="u-title1 ml-4">Discard changes?</span>
            </div>
            <div class="mt-3 ml-12 u-body2">
              This can’t be undone and you’ll lose your changes.{' '}
            </div>
            <div class="flex justify-end mt-20">
              <UButton
                size="large"
                type="primary"
                ghost
                class="w-41 mr-4"
                onClick={() => (this.modalVisibleState = false)}
              >
                Cancel
              </UButton>
              <UButton size="large" type="primary" class="w-41" onClick={this.closeDrawer}>
                Yes
              </UButton>
            </div>
          </UCard>
        </UModal>
      </div>
    )
  }
})

export default CreateBountyForm
