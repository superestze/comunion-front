import { UButton } from '@comunion/components'
import { defineComponent } from 'vue'
import { PayDailog } from '../Dialog'
import ProjectCard from '../ProjectCard'
import ProjectCarousel from '../ProjectCarousel'
import Text from '../Text'
import PaymentCard from './Card'

export default defineComponent({
  setup() {
    return () => (
      <>
        {/* <ApplyDialog
          visible={true}
          applyInfo={{
            applicantsDeposit: 0,
            test1: '',
            bio: ''
          }}
        /> */}
        {/* <BasicDialog
          visible={true}
          title="Unapprove the applicant ？"
          content="You will stop to cooperate with the applicant, meanwhile the bounty will be closed"
          v-slots={{
            btns: () => (
              <div class="flex justify-end mt-80px">
                <UButton type="default" class="w-164px mr-16px" size="small">
                  Cancel
                </UButton>
                <UButton type="primary" class="w-164px" size="small">
                  Yes
                </UButton>
              </div>
            )
          }}
        /> */}
        {/* <BasicDialog
          visible={true}
          title="Unapprove failed"
          content=" You have to release all deposits before you do unapprove"
          v-slots={{
            btns: () => (
              <div class="flex justify-end mt-80px">
                <UButton type="primary" class="w-164px" size="small">
                  OK
                </UButton>
              </div>
            )
          }}
        /> */}
        {/* <BasicDialog
          visible={true}
          title="Unlock the  deposits  ？"
          content="It is recommended that you unlock the deposit after completing the bounty."
          v-slots={{
            btns: () => (
              <div class="flex justify-end mt-80px">
                <UButton type="default" class="w-164px mr-16px" size="small">
                  Cancel
                </UButton>
                <UButton type="primary" class="w-164px" size="small">
                  Yes
                </UButton>
              </div>
            )
          }}
        /> */}
        {/* <BasicDialog
          visible={true}
          title="Release deposit？"
          content=" All deposits will be released."
          v-slots={{
            btns: () => (
              <div class="flex justify-end mt-80px">
                <UButton type="default" class="w-164px mr-16px" size="small">
                  Cancel
                </UButton>
                <UButton type="primary" class="w-164px" size="small">
                  Yes
                </UButton>
              </div>
            )
          }}
        /> */}
        <PayDailog
          visible={false}
          paymentInfo={{
            applicantsDeposit: 0,
            discussionLink: ''
          }}
        />
        <div class="flex justify-between">
          <PaymentCard
            title="Rewards"
            class="w-401px"
            v-slots={{
              btn: () => <UButton class="w-321px mt-60px mb-48px mx-auto">Close bounty</UButton>,
              text: () => (
                <>
                  <Text class="mt-60px" unit="USDC" />
                  <Text class="mt-40px" unit="UVU" />
                </>
              )
            }}
          />
          <PaymentCard
            title="Rewards"
            class="w-401px"
            v-slots={{
              title: () => (
                <p class="flex justify-between items-center bg-purple h-72px">
                  <span class="text-20px ml-24px">Deposit</span>
                  <div class="mr-24px">Block</div>
                </p>
              ),
              btn: () => (
                <div class="flex w-322px mt-60px mb-48px mx-auto">
                  <UButton class="w-148px mr-25px">+ Deposit</UButton>
                  <UButton class="w-148px" type="primary">
                    Release
                  </UButton>
                </div>
              ),
              text: () => (
                <>
                  <Text
                    class="mt-60px"
                    v-slots={{
                      unit: () => (
                        <span class="flex flex-col justify-center">
                          <span class="text-16px">USDC</span>
                          <span class="text-16px">Founder</span>
                        </span>
                      )
                    }}
                  />
                  <Text
                    class="mt-40px"
                    v-slots={{
                      unit: () => (
                        <span class="flex flex-col">
                          <span>USDC</span>
                          <span>Applicant</span>
                        </span>
                      )
                    }}
                  />
                </>
              )
            }}
          />
        </div>
        <div class="n-card-header my-40px">
          <div class="n-card-header__main" role="heading">
            TERMS
          </div>
          <div class="subtitle">
            <span class="text-grey3 text-16px">Total Stage:</span>
            <span class="text-primary">10</span>
          </div>
        </div>
        <ProjectCarousel width={820}>
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
        </ProjectCarousel>
      </>
    )
  }
})
