import { UBreadcrumb, UBreadcrumbItem, UButton, UCard, USpin } from '@comunion/components'
import { ArrowLeftOutlined } from '@comunion/icons'
import { defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BountyCard from './components/BountyCard'
import { ActivityBubble, ApplicantBubble, DepositBubble } from './components/Bubble'
import { Payment } from './components/Payment'
import PersonalCard from './components/PersonalCard'
import StartupCard from './components/StartupCard'

const startup: any = {
  id: 130228425011200,
  createdAt: '2022-07-06T01:58:54Z',
  updatedAt: '2022-07-06T03:29:52Z',
  isDeleted: false,
  comerID: 129525702930432,
  name: 'test',
  mode: 1,
  logo: '',
  mission:
    'pendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpv',
  tokenContractAddress: '',
  overview:
    'pendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpendingpending',
  chainID: 43113,
  blockChainAddress: '0x3dba21d6601c5b013438556662fce633cf146ed8d066f7ff57d34f31991e46ea',
  isSet: false,
  kyc: 'kyc',
  contractAudit: 'xososjofnene',
  hashTags: [
    {
      id: 124275369652224,
      createdAt: '2022-06-19T15:43:35Z',
      updatedAt: '2022-06-19T15:43:35Z',
      isDeleted: false,
      name: 'WEB3',
      category: 'startup',
      isIndex: false
    },
    {
      id: 124275369652225,
      createdAt: '2022-06-19T15:43:35Z',
      updatedAt: '2022-06-19T15:43:35Z',
      isDeleted: false,
      name: 'NFT',
      category: 'startup',
      isIndex: false
    },
    {
      id: 124898093772800,
      createdAt: '2022-06-21T08:58:04Z',
      updatedAt: '2022-06-21T08:58:04Z',
      isDeleted: false,
      name: 'CRYPTO',
      category: 'startup',
      isIndex: false
    },
    {
      id: 125586962067456,
      createdAt: '2022-06-23T06:35:22Z',
      updatedAt: '2022-06-23T06:35:22Z',
      isDeleted: false,
      name: 'NCO',
      category: 'startup',
      isIndex: false
    }
  ],
  website: '',
  discord: '',
  twitter: '',
  telegram: '',
  docs: '',
  launchNetwork: 0,
  tokenName: '',
  tokenSymbol: '',
  totalSupply: 0,
  presaleStart: '',
  presaleEnd: '',
  launchDate: '',
  wallets: [],
  members: [
    {
      id: 130228425011201,
      createdAt: '2022-07-06T01:58:54Z',
      updatedAt: '2022-07-06T01:58:54Z',
      comerID: 129525702930432,
      startupID: 130228425011200,
      position: 'founder',
      comer: {
        id: 129525702930432,
        createdAt: '2022-07-04T03:26:31Z',
        updatedAt: '2022-07-04T03:26:31Z',
        isDeleted: false,
        address: '0x1Ce32739c33Eecb06dfaaCa0E42bd04E56CCbF0d'
      },
      comerProfile: {
        id: 129525975560193,
        createdAt: '2022-07-04T03:27:36Z',
        updatedAt: '2022-07-04T03:27:36Z',
        isDeleted: false,
        comerID: 129525702930432,
        name: 'jiagang',
        avatar: 'https://comunion-avatars.s3.ap-northeast-1.amazonaws.com/avatar1.svg',
        location: 'wuhan',
        timeZone: '(UTC) UTC',
        website: '',
        email: '1350663559@qq.com',
        twitter: '',
        discord: '',
        telegram: '',
        medium: '',
        bio: 'never stop,never stopnever stopnever stopnever stopnever stopnever stopnever stopnever stopnever stopnever stopnever stopnever stopnever stop',
        skills: null
      }
    }
  ],
  memberCount: 1,
  follows: [],
  followCount: 0
}

const profile: any = {
  id: 131702060167171,
  createdAt: '2022-07-10T03:34:36Z',
  updatedAt: '2022-07-10T03:34:36Z',
  isDeleted: false,
  comerID: 125678234316800,
  name: 'undefined',
  avatar: 'https://comunion-avatars.s3.ap-northeast-1.amazonaws.com/avatar1.svg',
  location: 'out space',
  timeZone: '(UTC) UTC',
  website: '',
  email: 'undefined@test.com',
  twitter: '',
  discord: '',
  telegram: '',
  medium: '',
  bio: 'That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.That is Bio.',
  skills: [
    {
      id: 124567620366337,
      createdAt: '2022-06-20T11:04:52Z',
      updatedAt: '2022-06-20T11:04:52Z',
      isDeleted: false,
      name: 'Project Manager',
      category: 'comerSkill',
      isIndex: false
    },
    {
      id: 124567620366338,
      createdAt: '2022-06-20T11:04:52Z',
      updatedAt: '2022-06-20T11:04:52Z',
      isDeleted: false,
      name: 'Product Manager',
      category: 'comerSkill',
      isIndex: false
    },
    {
      id: 124570619293696,
      createdAt: '2022-06-20T11:16:47Z',
      updatedAt: '2022-06-20T11:16:47Z',
      isDeleted: false,
      name: 'Designer',
      category: 'comerSkill',
      isIndex: false
    }
  ],
  comerAccounts: [
    { linked: true, accountType: 1, accountId: 125578548293633 },
    { linked: false, accountType: 2, accountId: 0 }
  ]
}

export default defineComponent({
  name: 'BountyDetail',
  setup() {
    const router = useRouter()
    const route = useRoute()

    return () => (
      <USpin show={false}>
        {/* <template v-slot="description">123kkj</template> */}
        <UBreadcrumb class="mb-10 mt-10">
          <UBreadcrumbItem v-slots={{ separator: () => <ArrowLeftOutlined /> }} />
          <UBreadcrumbItem>
            <span
              class="u-label2 cursor-pointer uppercase text-primary"
              onClick={() => {
                router.back()
              }}
            >
              Back
            </span>
          </UBreadcrumbItem>
        </UBreadcrumb>
        <div class="flex gap-6 mb-20">
          <div class="basis-2/3">
            <div class="bg-white p-10 rounded-lg border mb-6">
              <BountyCard />
            </div>
            <UCard title="PAYMENT" class="mb-6 !pb-8">
              <Payment />
            </UCard>
            <UCard title="ACTIVITIES" class="mb-6">
              <ActivityBubble />
              {/* <UNoContent textTip="NO ACTIVITIES YET" class="my-10">
                <EmptyFilled />
              </UNoContent> */}
            </UCard>
            <UCard title="APPLICANTS">
              <ApplicantBubble />
              {/* <UNoContent textTip="NO APPLICANTS YET" class="my-10">
                <EmptyFilled />
              </UNoContent> */}
            </UCard>
          </div>
          <div class="basis-1/3">
            <UCard class="mb-6">
              <StartupCard startup={startup} />
            </UCard>
            <UCard title="FOUNDER" class="mb-6">
              <PersonalCard profile={profile} class="mt-20px" />
            </UCard>
            <UCard
              title="APPROVED"
              class="mb-6"
              v-slots={{
                'header-extra': () => (
                  <UButton type="primary" ghost size="small" class="w-120px">
                    Unapprove
                  </UButton>
                )
              }}
            >
              <PersonalCard profile={profile} class="mt-20px" />
            </UCard>
            <UCard title="DEPOSIT RECORDS">
              <DepositBubble />
              {/* <UNoContent textTip="NO DEPOSIT RECORDS YET" class="my-10">
                <EmptyFilled />
              </UNoContent> */}
            </UCard>
          </div>
        </div>
      </USpin>
    )
  }
})
