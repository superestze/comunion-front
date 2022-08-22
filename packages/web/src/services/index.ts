/* eslint-disable */
import { requestAdapter } from './a2s.adapter'
import { extract, replacePath } from './a2s.utils'

export const services = {
  'account@connectors-of-comer'(
    args: {
      comerID: any
    } & {
      page: number
      limit?: number
    }
  ) {
    return requestAdapter<{
      limit: number
      page: string
      totalRows: number
      totalPages: number
      rows: {
        comerId: number
        comerAvatar: string
        comerName: string
        followedByMe: boolean
      }[]
    }>({
      url: replacePath('/account/profile/connectors/:comerID', args),
      method: 'POST',
      ...extract('POST', args, [], ['comerID'])
    })
  },
  'account@educations'(
    args: {
      school: string
      majro: string
      graducatedAt: string
    }[]
  ) {
    return requestAdapter<{}>({
      url: replacePath('/account/profile/educations', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'account@langages'(
    args: {
      language: string
      /**
       * @description Beginner 、Elementary、Intermediate、Advanced
       */
      level: string
    }[]
  ) {
    return requestAdapter<{}>({
      url: replacePath('/account/profile/languages', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'account@modules-of-comer'(args: { comerID: any }) {
    return requestAdapter<
      {
        /**
   * @description 
	ModuleStartup - 1
	ModuleBounty - 2
	ModuleCrowdfunding - 3
	ModuleProposal - 4


     */
        module: number
        hasCreated: boolean
      }[]
    >({
      url: replacePath('/account/profile/modules/:comerID', args),
      method: 'GET',
      ...extract('GET', args, [], ['comerID'])
    })
  },
  'account@social-add-or-update'(args?: any) {
    return requestAdapter<{
      /**
   * @description 	1-SocialEmail 
	2-SocialWebsite
	3-SocialTwitter
	4-SocialDiscord
	5-SocialTelegram
	6-SocialMedium
	7-SocialFacebook
	8-SocialLinktre
     */
      socialType: number
      /**
       * @description 为空表示删除值
       */
      socialLink?: string
    }>({
      url: replacePath('/account/profile/social', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'account@social-delete'(args?: any) {
    return requestAdapter<{
      /**
   * @description 	1-SocialEmail 
	2-SocialWebsite
	3-SocialTwitter
	4-SocialDiscord
	5-SocialTelegram
	6-SocialMedium
	7-SocialFacebook
	8-SocialLinktre
     */
      socialType: number
    }>({
      url: replacePath('/account/profile/social', args),
      method: 'DELETE',
      ...extract('DELETE', args, [], [])
    })
  },
  'account@update-bio'(args: { bio: string }) {
    return requestAdapter<{}>({
      url: replacePath('/account/profile/bio', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'account@update-comer-skills'(args: { skills: string[] }) {
    return requestAdapter<{}>({
      url: replacePath('/account/profile/skills', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'account@update-cover'(args: { image: string }) {
    return requestAdapter<{}>({
      url: replacePath('/account/profile/cover', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'account@wallet-nonce-get'(args: { address: any }) {
    return requestAdapter<{
      nonce?: string
    }>({
      url: replacePath('/account/eth/nonce', args),
      method: 'GET',
      ...extract('GET', args, ['address'], [])
    })
  },
  'account@comer-info-get'(args: { comerId: any }) {
    return requestAdapter<{
      id: number
      createdAt: string
      updatedAt: string
      isDeleted: boolean
      address: string
      comerProfile?: {
        id: number
        createdAt: string
        updatedAt: string
        isDeleted: boolean
        comerID: number
        name: string
        avatar: string
        location: string
        timeZone: string
        website: string
        email: string
        twitter: string
        discord: string
        telegram: string
        medium: string
        bio: string
        skills: {
          id: number
          createdAt: string
          updatedAt: string
          isDeleted: boolean
          name: string
          category: string
          isIndex: boolean
        }[]
      }
      /**
       * @description follow list
       */
      follows: {
        comerID: number
        comer?: {
          id: number
          createdAt: string
          updatedAt: string
          isDeleted: boolean
          address: string
        }
        comerProfile?: {
          id: number
          createdAt: string
          updatedAt: string
          isDeleted: boolean
          comerID: number
          name: string
          avatar: string
          location: string
          timeZone: string
          website: string
          email: string
          twitter: string
          discord: string
          telegram: string
          medium: string
          bio: string
          skills: {
            id: number
            createdAt: string
            updatedAt: string
            isDeleted: boolean
            name: string
            category: string
            isIndex: boolean
          }[]
        }
      }[]
      /**
       * @description follow number
       */
      followsCount: number
      /**
       * @description fans list
       */
      followed: {
        comerID: number
        comer?: {
          id: number
          createdAt: string
          updatedAt: string
          isDeleted: boolean
          address: string
        }
        comerProfile?: {
          id: number
          createdAt: string
          updatedAt: string
          isDeleted: boolean
          comerID: number
          name: string
          avatar: string
          location: string
          timeZone: string
          website: string
          email: string
          twitter: string
          discord: string
          telegram: string
          medium: string
          bio: string
          skills: {
            id: number
            createdAt: string
            updatedAt: string
            isDeleted: boolean
            name: string
            category: string
            isIndex: boolean
          }[]
        }
      }[]
      /**
       * @description fans number
       */
      followedCount: number
    }>({
      url: replacePath('/account/comer/{comerId}', args),
      method: 'GET',
      ...extract('GET', args, [], ['comerId'])
    })
  },
  'account@comer-info-get-by-address'(args: { address: any }) {
    return requestAdapter<{
      id: number
      createdAt: string
      updatedAt: string
      isDeleted: boolean
      Address: string
      comerProfile?: {
        id: number
        createdAt: string
        updatedAt: string
        isDeleted: boolean
        comerID: number
        name: string
        avatar: string
        location: string
        website: string
        bio: string
        skills: {
          id: number
          createdAt: string
          updatedAt: string
          isDeleted: boolean
          name: string
          category: string
          isIndex: boolean
        }[]
      }
    }>({
      url: replacePath('/account/comer/address/{address}', args),
      method: 'GET',
      ...extract('GET', args, [], ['address'])
    })
  },
  'account@oauth-register'(args: {
    /**
     * @description oauth帐号在系统中的comerAccount ID
     */
    oauthAccountId: number
    /**
     * @description comer-profile-create接口参数
     */
    profile?: {
      name: string
      avatar: string
      location?: string
      timeZone: string
      website?: string
      email: string
      skills?: string[]
      twitter?: string
      discord?: string
      telegram?: string
      medium?: string
      bio: string
    }
  }) {
    return requestAdapter<{
      /**
       * @description comerId为空或0表示该oauth帐号未关联comer
       */
      comerId: number
      nick: string
      avatar: string
      address: string
      token: string
      isProfiled: boolean
      /**
       * @description 该oauth帐号是否关联已经存在comer
       */
      oauthLinked: boolean
      /**
       * @description 该oauth帐号的comerAccount的ID
       */
      oauthAccountId: number
    }>({
      url: replacePath('/account/oauth/register', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'account@oauth-first-login-with-wallet-link'(
    args: {
      /**
       * @description oauth-xx-login-callback接口返回的accountId
       */
      oauthAccountId: any
      /**
       * @description 钱包地址
       */
      address: any
    } & {}
  ) {
    return requestAdapter<{
      /**
       * @description comerId为空或0表示该oauth帐号未关联comer
       */
      comerId: number
      nick: string
      avatar: string
      address: string
      token: string
      /**
       * @description 是否填写了简历
       */
      isProfiled: boolean
      /**
       * @description 该oauth帐号是否关联已经存在comer
       */
      oauthLinked: boolean
      /**
       * @description 该oauth帐号的comerAccount的ID
       */
      oauthAccountId: number
    }>({
      url: replacePath('/account/oauth/login-link-by-wallet', args),
      method: 'GET',
      ...extract('GET', args, ['oauthAccountId', 'address'], [])
    })
  },
  'account@wallet-login'(args: { signature: string; address: string }) {
    return requestAdapter<{
      name: string
      avatar: string
      address: string
      token: string
      isProfiled: boolean
      /**
       * @description 是否首次使用该钱包登录，如果为false，需要提示绑定已有oauth帐号或者注册
       */
      firstLogin: boolean
    }>({
      url: replacePath('/account/eth/wallet/login', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'account@wallet-link'(args: { signature: string; address: string }) {
    return requestAdapter<{
      /**
       * @description 是否填写简历
       */
      isProfiled: boolean
      /**
       * @description 登录token
       */
      token: string
    }>({
      url: replacePath('/account/eth/wallet/link', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'account@oauth-google-login'(args?: any) {
    return requestAdapter<{}>({
      url: replacePath('/account/oauth/google/login', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'account@oauth-github-login'(args?: any) {
    return requestAdapter<{}>({
      url: replacePath('/account/oauth/github/login', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'account@oauth-google-login-callback'(args: { state: any; code: any }) {
    return requestAdapter<{
      /**
       * @description comerId为空或0表示该oauth帐号未关联comer
       */
      comerId: number
      nick: string
      avatar: string
      address: string
      token: string
      isProfiled: boolean
      /**
       * @description 该google帐号是否关联已经存在comer
       */
      oauthLinked: boolean
      /**
       * @description 该google帐号的comerAccount的ID
       */
      oauthAccountId: number
    }>({
      url: replacePath('/account/oauth/google/login/callback', args),
      method: 'GET',
      ...extract('GET', args, ['state', 'code'], [])
    })
  },
  'account@oauth-github-login-callback'(args: {
    state: any
    /**
     * @description github返回的code码
     */
    code: any
  }) {
    return requestAdapter<{
      /**
       * @description comer的ID，为0或空表示该oauth帐号未关联到comer
       */
      comerId: string
      nick: string
      avatar: string
      address: string
      token: string
      /**
       * @description 是否填写了profile
       */
      isProfiled: boolean
      /**
       * @description 该gihub帐号是否已关联了comer
       */
      oauthLinked: boolean
      /**
       * @description 该github帐号的commerAccount的ID
       */
      oauthAccountId: number
    }>({
      url: replacePath('/account/oauth/github/login/callback', args),
      method: 'GET',
      ...extract('GET', args, ['state', 'code'], [])
    })
  },
  'account@account-list'(args?: any) {
    return requestAdapter<{
      list?: {
        id: number
        createdAt: string
        updatedAt: string
        isDeleted: boolean
        comerID: number
        oin: string
        isPrimary: boolean
        nick: string
        avatar: string
        /**
         * @description 1.github 2.google
         */
        type: number
        isLinked: boolean
      }[]
      total: number
    }>({
      url: replacePath('/account/list', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'account@user-info'(args?: any) {
    return requestAdapter<{
      nick: string
      avatar: string
      address: string
      token: string
      isProfiled: boolean
    }>({
      url: replacePath('/account/user/info', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'account@oauth-account-unlink'(args: { accountID: any }) {
    return requestAdapter<any>({
      url: replacePath('/account/:accountID/unlink', args),
      method: 'DELETE',
      ...extract('DELETE', args, [], ['accountID'])
    })
  },
  'account@comer-profile-create'(args: {
    name: string
    avatar: string
    location?: string
    timeZone: string
    website?: string
    email: string
    skills: string[]
    twitter?: string
    discord?: string
    telegram?: string
    medium?: string
    bio: string
  }) {
    return requestAdapter<{}>({
      url: replacePath('/account/profile', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'account@comer-profile-update'(args: {
    name: string
    avatar: string
    location: string
    timeZone: string
    website: string
    email: string
    skills: string[]
    twitter: string
    discord: string
    telegram: string
    medium: string
    bio: string
  }) {
    return requestAdapter<{}>({
      url: replacePath('/account/profile', args),
      method: 'PUT',
      ...extract('PUT', args, [], [])
    })
  },
  'account@comer-profile-get'(args?: any) {
    return requestAdapter<{
      id?: number
      createdAt?: string
      updatedAt?: string
      isDeleted?: boolean
      comerID?: number
      name?: string
      avatar?: string
      cover?: string
      location?: string
      timeZone: string
      website?: string
      email: string
      twitter: string
      discord: string
      telegram: string
      medium: string
      facebook?: string
      linktree?: string
      bio?: string
      skills?: {
        id?: number
        createdAt?: string
        updatedAt?: string
        isDeleted?: boolean
        name?: string
        isIndex?: boolean
      }[]
      /**
       * @description 该comer下的oauth Account绑定情况(目前仅google、github)
       */
      comerAccounts: {
        /**
         * @description 是否绑定
         */
        linked: boolean
        /**
         * @description 类型,1-github,2-google
         */
        accountType: number
        /**
         * @description accountId
         */
        accountId?: number
      }[]
    }>({
      url: replacePath('/account/profile', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'account@comer-follow'(args: { comerId: any }) {
    return requestAdapter<{}>({
      url: replacePath('/account/comer/{comerId}/follow', args),
      method: 'POST',
      ...extract('POST', args, [], ['comerId'])
    })
  },
  'account@comer-unfollow'(args: { comerId: any }) {
    return requestAdapter<{}>({
      url: replacePath('/account/comer/{comerId}/unfollow', args),
      method: 'DELETE',
      ...extract('DELETE', args, [], ['comerId'])
    })
  },
  'account@comer-followed-by-me'(args: { comerId: any }) {
    return requestAdapter<{
      isFollowed: boolean
    }>({
      url: replacePath('/account/comer/{comerId}/followedByMe', args),
      method: 'GET',
      ...extract('GET', args, [], ['comerId'])
    })
  },

  'bounty@bounty-activities'(
    args: {
      bountyID: any
    } & {
      content?: string
      /**
       * @description 1.normal 2.send-paid-info
       */
      sourceType: number
    }
  ) {
    return requestAdapter<{
      data?: string
    }>({
      url: replacePath('/bounty/:bountyID/postUpdate', args),
      method: 'POST',
      ...extract('POST', args, [], ['bountyID'])
    })
  },
  'bounty@bounty-activities-list'(args: { bountyID: any }) {
    return requestAdapter<
      {
        comerID?: string
        name?: string
        avatar?: string
        sourceType?: number
        content?: string
        timestamp?: string
      }[]
    >({
      url: replacePath('/bounty/{bountyID}/activities', args),
      method: 'GET',
      ...extract('GET', args, [], ['bountyID'])
    })
  },
  'bounty@bounty-add-deposit'(
    args: {
      bountyID: any
    } & {
      bountyID?: string
      chainID?: number
      txHash?: string
      tokenSymbol: string
      tokenAmount: number
    }
  ) {
    return requestAdapter<{
      data?: string
    }>({
      url: replacePath('/bounty/{bountyID}/addDeposit', args),
      method: 'POST',
      ...extract('POST', args, [], ['bountyID'])
    })
  },
  'bounty@bounty-applicant-lock'(args: { bountyID: any }) {
    return requestAdapter<{
      data?: string
    }>({
      url: replacePath('/bounty/{bountyID}/applicant/lock', args),
      method: 'POST',
      ...extract('POST', args, [], ['bountyID'])
    })
  },
  'bounty@bounty-applicants-apply'(
    args: {
      bountyID: any
    } & {
      applicants?: {
        description?: string
      }
      applicantsDeposit?: {
        tokenSymbol?: string
        tokenAmount?: number
        chainID: number
        txHash: string
      }
    }
  ) {
    return requestAdapter<{
      data?: string
    }>({
      url: replacePath('/bounty/:bountyID/applicants/apply', args),
      method: 'POST',
      ...extract('POST', args, [], ['bountyID'])
    })
  },
  'bounty@bounty-applicants-unlock'(args: { bountyID: any }) {
    return requestAdapter<{
      data?: string
    }>({
      url: replacePath('/bounty/{bountyID}/applicant/unlock', args),
      method: 'POST',
      ...extract('POST', args, [], ['bountyID'])
    })
  },
  'bounty@bounty-approved'(args: { bountyID: any }) {
    return requestAdapter<{
      image?: string
      name?: string
      applicantsSkills?: string[]
      comerID: number
    }>({
      url: replacePath('/bounty/{bountyID}/approved', args),
      method: 'GET',
      ...extract('GET', args, [], ['bountyID'])
    })
  },
  'bounty@bounty-close'(
    args: {
      bountyID: any
    } & {}
  ) {
    return requestAdapter<{
      data?: string
    }>({
      url: replacePath('/bounty/{bountyID}/close', args),
      method: 'POST',
      ...extract('POST', args, [], ['bountyID'])
    })
  },
  'bounty@bounty-create'(args: {
    bountyDetail?: {
      startupID?: number
      comerID?: number
      title?: string
      expiresIn?: string
      contact?: {
        /**
         * @description  1:Email 2:Discord 3:Telegram
         */
        contactType?: number
        contactAddress?: string
      }[]
      discussionLink?: string
      applicantsSkills?: string[]
      applicantsDeposit?: number
      description?: string
    }
    payDetail?: {
      stages?: {
        seqNum?: number
        token1Symbol?: string
        token1Amount?: number
        token2Symbol?: string
        token2Amount?: number
        terms?: string
      }[]
      period?: {
        /**
         * @description 1:Days 2:Weeks 3:Months
         */
        periodType?: number
        hoursPerDay?: number
        token1Symbol?: string
        token1Amount?: number
        token2Symbol?: string
        token2Amount?: number
        target?: string
        periodAmount: number
      }
    }
    deposit?: {
      tokenSymbol?: string
      tokenAmount?: number
    }
    chainInfo?: {
      chainID?: number
      txHash?: string
    }
  }) {
    return requestAdapter<{
      code?: number
      data?: string
    }>({
      url: replacePath('/bounty/create', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'bounty@bounty-deposit-records'(args: { bountyID: any }) {
    return requestAdapter<
      {
        name?: string
        comerID: string
        time?: string
        tokenAmount?: number
        /**
         * @description 1:In 2:Out&#39;
         */
        access?: number
        avatar: string
      }[]
    >({
      url: replacePath('/bounty/{bountyID}/deposits', args),
      method: 'GET',
      ...extract('GET', args, [], ['bountyID'])
    })
  },
  'bounty@bounty-detail-status'(args: { bountyID: any }) {
    return requestAdapter<{
      /**
       * @description 1创建者 2 申请者 3其他人
       */
      role?: number
      lock?: boolean
      release?: boolean
    }>({
      url: replacePath('/bounty/{bountyID}/detail/status', args),
      method: 'GET',
      ...extract('GET', args, [], ['bountyID'])
    })
  },
  'bounty@bounty-founder'(args: { bountyID: any }) {
    return requestAdapter<{
      image?: string
      location: string
      email: string
      comerID: number
      name?: string
      applicantsSkills?: string[]
      timeZone?: string
    }>({
      url: replacePath('/bounty/{bountyID}/founder', args),
      method: 'GET',
      ...extract('GET', args, [], ['bountyID'])
    })
  },
  'bounty@bounty-founder-approve'(
    args: {
      bountyID: any
      applicantComerID: any
    } & {
      chainID?: number
      txHash?: string
    }
  ) {
    return requestAdapter<{
      data?: string
    }>({
      url: replacePath('/bounty/:bountyID/approve/:applicantComerID', args),
      method: 'POST',
      ...extract('POST', args, [], ['bountyID', 'applicantComerID'])
    })
  },
  'bounty@bounty-founder-unapprove'(
    args: {
      bountyID: any
      applicantComerID: any
    } & {}
  ) {
    return requestAdapter<{
      data?: string
    }>({
      url: replacePath('/bounty/{bountyID}/unapprove/{applicantComerID}', args),
      method: 'POST',
      ...extract('POST', args, [], ['bountyID', 'applicantComerID'])
    })
  },
  'bounty@bounty-get-detail'(args: { bountyID: any }) {
    return requestAdapter<{
      title?: string
      /**
       * @description 1:Ready to work 2:Work started 3:Completed 4:Expired
       */
      status?: number
      applicantsSkills?: string[]
      discussionLink?: string
      expiresIn?: string
      applicantsDeposit?: number
      description?: string
      /**
       * @description 1:Email 2:Discord 3:Telegram
       */
      contact?: {
        contactType?: number
        contactAddress?: string
      }[]
      createdAt?: string
      /**
       * @description 押金合约地址
       */
      depositContract?: string
    }>({
      url: replacePath('/bounty/{bountyID}/detail', args),
      method: 'GET',
      ...extract('GET', args, [], ['bountyID'])
    })
  },
  'bounty@bounty-list(tab)'(
    args: {
      /**
       * @description 当前页
       * @example 1
       */
      page: any
      /**
       * @description Created:Recent\Created:oldest\Value:Highest\Value:Lowest\Deposit:Highest\Deposit:Lowest
       * @example 排序
       */
      sort?: any
    } & {
      /**
       * @description 第几页，默认1
       */
      page: number
      /**
       * @description 排序：字段:asc/desc
       */
      sort: string
    }
  ) {
    return requestAdapter<{
      /**
       * @description 每页记录数
       */
      limit: number
      /**
       * @description 当前页
       */
      page: number
      /**
       * @description 总记录数
       */
      totalRows: number
      /**
       * @description 总页数
       */
      totalPages: number
      /**
       * @description 记录列表
       */
      rows: {
        /**
         * @description bountyId
         */
        bountyId: number
        /**
         * @description startup id
         */
        startupId: number
        logo: string
        /**
         * @description 标题
         */
        title: string
        /**
         * @description 状态
         */
        status: string
        /**
         * @description 支付方式
         */
        paymentType: string
        /**
         * @description 创建时间
         */
        createdTime: number
        /**
         * @description 报酬
         */
        rewards?: {
          /**
           * @description 币类型:uvu,其他
           */
          tokenSymbol: string
          /**
           * @description 总额
           */
          amount: string
        }[]
        /**
         * @description 申请人数
         */
        applicantCount: number
        /**
         * @description 押金要求
         */
        depositRequirements: number
        /**
         * @description 技能要求
         */
        applicationSkills: string[]
      }[]
    }>({
      url: replacePath('/cores/bounties', args),
      method: 'GET',
      ...extract('GET', args, ['page', 'sort'], [])
    })
  },
  'bounty@bounty-list-applicants'(args: { bountyID: any }) {
    return requestAdapter<
      {
        comerID?: string
        name?: string
        image?: string
        description?: string
        applyAt?: string
        address: string
      }[]
    >({
      url: replacePath('/bounty/{bountyID}/applicants', args),
      method: 'GET',
      ...extract('GET', args, [], ['bountyID'])
    })
  },
  'bounty@bounty-paid'(
    args: {
      bountyID: any
    } & {
      seqNum?: number
      paidInfo?: {
        tokenSymbol?: string
        tokenAmount?: number
        txHash?: string
      }[]
    }
  ) {
    return requestAdapter<{
      data?: string
    }>({
      url: replacePath('/bounty/:bountyID/paid', args),
      method: 'POST',
      ...extract('POST', args, [], ['bountyID'])
    })
  },
  'bounty@bounty-payment'(args: { bountyID: any }) {
    return requestAdapter<{
      periodTerms?: {
        terms?: string
        hoursPerDay: number
        /**
         * @description 1:Days 2:Weeks 3:Months
         */
        periodType: number
        periodModes?: {
          seqNum?: number
          status?: number
          token1Symbol?: string
          token2Symbol?: string
          token1Amount?: number
          token2Amount?: number
        }[]
      }
      rewards?: {
        token1Symbol?: string
        token2Amount?: number
        token1Amount?: number
        token2Symbol?: string
      }
      applicantsTotalDeposit?: number
      /**
       * @description 3 为上锁状态
       */
      bountyDepositStatus: number
      /**
       * @description  0 任何人1 :Pending 2:Applied 3:Approved 4:Submitted 5:Revoked 6：Rejected 7:Quited
       */
      applicantApplyStatus: number
      bountyPaymentInfo?: {
        founderDeposit?: number
        /**
         * @description 1 stage 2 period
         */
        paymentMode?: number
        /**
         * @description 申请最少缴纳的押金额
         */
        applicantMinDeposit: number
      }
      stageTerms?: {
        seqNum?: number
        status?: number
        token1Symbol?: string
        token2Symbol?: string
        token1Amount?: number
        token2Amount?: number
        terms?: string
      }[]
    }>({
      url: replacePath('/bounty/{bountyID}/payment', args),
      method: 'GET',
      ...extract('GET', args, [], ['bountyID'])
    })
  },
  'bounty@bounty-release'(
    args: {
      bountyID: any
    } & {
      tokenSymbol?: string
      tokenAmount?: number
      chainID?: number
      TxHash?: string
    }
  ) {
    return requestAdapter<{
      data?: string
    }>({
      url: replacePath('/bounty/{bountyID}/release', args),
      method: 'POST',
      ...extract('POST', args, [], ['bountyID'])
    })
  },
  'bounty@bounty-release-my-deposit'(
    args: {
      bountyID: any
    } & {
      chainID?: number
      txHash?: string
    }
  ) {
    return requestAdapter<{
      data?: string
    }>({
      url: replacePath('/bounty/{bountyID}/releaseMyDeposit', args),
      method: 'POST',
      ...extract('POST', args, [], ['bountyID'])
    })
  },
  'bounty@bounty-startup-list'(args: { bountyID: any }) {
    return requestAdapter<{
      logo?: string
      mission: string
      title?: string
      chainID?: number
      blockChainAddress?: string
      website?: string
      discord?: string
      twitter?: string
      telegram?: string
      mode?: number
      contractAudit?: string
      docs: string
      tag: string[]
    }>({
      url: replacePath('/bounty/{bountyID}/startup', args),
      method: 'GET',
      ...extract('GET', args, [], ['bountyID'])
    })
  },
  'bounty@bounty-startups'(args: { comerID: any }) {
    return requestAdapter<{
      total?: number
      list?: {
        startupID: number
        name: string
      }[]
    }>({
      url: replacePath('/cores/startups/comer/{comerID}', args),
      method: 'GET',
      ...extract('GET', args, [], ['comerID'])
    })
  },
  'bounty@bounty-state'(args: { bountyID: any }) {
    return requestAdapter<{
      /**
       * @description // bounty状态 0. pending 1: ReadyToWork 2: WordStarted 3: Completed 4: Expired
       */
      bountyStatus?: number
      /**
       * @description 申请者数量
       */
      applicantCount?: number
      /**
       * @description 存入余额
       */
      depositBalance?: number
      /**
       * @description founder存入金额
       */
      founderDepositAmount?: number
      /**
       * @description 申请者存入金额
       */
      applicantDepositAmount?: number
      /**
       * @description 最小存入金额
       */
      applicantDepositMinAmount?: number
      /**
       * @description 锁定
       */
      depositLock?: boolean
      /**
       * @description post update锁
       */
      timeLock?: number
      /**
       * @description // 1: founder, 2: 申请者；3：其他
       */
      myRole?: number
      /**
       * @description 我的存入金额
       */
      myDepositAmount?: number
      /**
       * @description 我的状态
       */
      myStatus?: number
    }>({
      url: replacePath('/bounty/{bountyID}/state', args),
      method: 'GET',
      ...extract('GET', args, [], ['bountyID'])
    })
  },
  'bounty@my-participated-bounty-list'(
    args: {
      /**
       * @description 当前页
       * @example 1
       */
      page: any
    } & {
      /**
       * @description 第几页，默认1
       */
      page: number
    }
  ) {
    return requestAdapter<{
      /**
       * @description 每页记录数
       */
      limit: number
      /**
       * @description 当前页
       */
      page: number
      /**
       * @description 总记录数
       */
      totalRows: number
      /**
       * @description 总页数
       */
      totalPages: number
      /**
       * @description 记录列表
       */
      rows: {
        /**
         * @description logo
         */
        bountyId: number
        /**
         * @description 上链状态
         */
        onChainStatus: string
        startupId: number
        logo: string
        /**
         * @description 标题
         */
        title: string
        /**
         * @description 状态
         */
        status: string
        /**
         * @description 支付方式
         */
        paymentType: string
        /**
         * @description 创建时间
         */
        createdTime: number
        /**
         * @description 报酬
         */
        rewards: {
          /**
           * @description 币类型:uvu,其他
           */
          tokenSymbol: string
          /**
           * @description 总额
           */
          amount: string
        }[]
        /**
         * @description 申请人数
         */
        applicantCount: number
        depositRequirements: number
        /**
         * @description 技能要求
         */
        applicationSkills: string[]
      }[]
    }>({
      url: replacePath('/cores/bounties/me/participated', args),
      method: 'GET',
      ...extract('GET', args, ['page'], [])
    })
  },
  'bounty@my-posted-bounty-list'(
    args: {
      /**
       * @description 当前页
       * @example 1
       */
      page: any
    } & {
      /**
       * @description 第几页，默认1
       */
      page: number
    }
  ) {
    return requestAdapter<{
      /**
       * @description 每页记录数
       */
      limit: number
      /**
       * @description 当前页
       */
      page: number
      /**
       * @description 总记录数
       */
      totalRows: number
      /**
       * @description 总页数
       */
      totalPages: number
      /**
       * @description 记录列表
       */
      rows: {
        /**
         * @description logo
         */
        bountyId: number
        startupId: number
        logo: string
        /**
         * @description 标题
         */
        title: string
        /**
         * @description 状态
         */
        status: string
        /**
         * @description 支付方式
         */
        paymentType: string
        /**
         * @description 创建时间
         */
        createdTime: number
        /**
         * @description 报酬
         */
        rewards: {
          /**
           * @description 币类型:uvu,其他
           */
          tokenSymbol: string
          /**
           * @description 总额
           */
          amount: string
        }[]
        /**
         * @description 申请人数
         */
        applicantCount: number
        depositRequirements: number
        /**
         * @description 技能要求
         */
        applicationSkills: string[]
        /**
         * @description 上链状态
         */
        onChainStatus: string
      }[]
    }>({
      url: replacePath('/cores/bounties/me/posted', args),
      method: 'GET',
      ...extract('GET', args, ['page'], [])
    })
  },
  'bounty@startup-bounty-list'(
    args: {
      startupId: any
    } & {
      /**
       * @description 当前页
       * @example 1
       */
      page: any
    } & {
      /**
       * @description 第几页，默认1
       */
      page: number
    }
  ) {
    return requestAdapter<{
      /**
       * @description 每页记录数
       */
      limit: number
      /**
       * @description 当前页
       */
      page: number
      /**
       * @description 总记录数
       */
      totalRows: number
      /**
       * @description 总页数
       */
      totalPages: number
      /**
       * @description 记录列表
       */
      rows: {
        bountyId: number
        startupId: number
        logo: string
        /**
         * @description 标题
         */
        title: string
        /**
         * @description 状态
         */
        status: string
        /**
         * @description 支付方式
         */
        paymentType: string
        /**
         * @description 创建时间
         */
        createdTime: number
        /**
         * @description 报酬
         */
        rewards: {
          /**
           * @description 币类型:uvu,其他
           */
          tokenSymbol: string
          /**
           * @description 总额
           */
          amount: string
        }[]
        /**
         * @description 申请人数
         */
        applicantCount: number
        depositRequirements: number
        /**
         * @description 技能要求
         */
        applicationSkills: string[]
      }[]
    }>({
      url: replacePath('/cores/bounties/startup/:startupId', args),
      method: 'GET',
      ...extract('GET', args, ['page'], ['startupId'])
    })
  },

  'crowdfunding@cancel-crowdfunding'(
    args: {
      crowdfundingId: any
    } & {
      txHash: string
    }
  ) {
    return requestAdapter<{}>({
      url: replacePath('/cores/crowdfundings/:crowdfundingId/cancel', args),
      method: 'POST',
      ...extract('POST', args, [], ['crowdfundingId'])
    })
  },
  'crowdfunding@comer-participated-crowdfunding-list'(
    args: {
      comerID: any
    } & {
      page: number
      limit?: number
      /**
       * @description 暂时不支持搜索
       */
      keyword?: string
    }
  ) {
    return requestAdapter<
      {
        crowdfundingId: number
        startupId: number
        comerId: number
        startupName: string
        endTime: string
        raiseBalance: number
        raisedPercent: number
        status: number
        startTime: string
        startupLogo: string
        crowdfundingContract: string
      }[]
    >({
      url: replacePath('/account/comer/:comerID/participated-crowdfundings', args),
      method: 'GET',
      ...extract('GET', args, [], ['comerID'])
    })
  },
  'crowdfunding@comer-posted-crowdfunding-list'(
    args: {
      comerID: any
    } & {
      page: number
      limit?: number
      /**
       * @description 暂时不支持搜索
       */
      keyword?: string
    }
  ) {
    return requestAdapter<
      {
        crowdfundingId: number
        startupId: number
        comerId: number
        startupName: string
        endTime: string
        raiseBalance: number
        raisedPercent: number
        status: number
        startTime: string
        startupLogo: string
        crowdfundingContract: string
      }[]
    >({
      url: replacePath('/account/comer/:comerID/posted-crowdfundings', args),
      method: 'GET',
      ...extract('GET', args, [], ['comerID'])
    })
  },
  'crowdfunding@create-crowdfunding'(args: {
    startupId: number
    chainId: number
    txHash: string
    teamWallet: string
    raiseGoal: number
    swapPercent: number
    /**
     * @description IBO rate
     */
    buyPrice: number
    sellTax: number
    maxBuyAmount: number
    /**
     * @description 格式： 2021-02-18T21:54:42.123Z
     */
    startTime: string
    /**
     * @description 格式：2021-02-18T21:54:42.123Z
     */
    endTime: string
    poster: string
    youtube?: string
    detail?: string
    description: string
    /**
     * @description 用于募资的tokne的地址
     */
    sellTokenContract: string
    sellTokenName?: string
    sellTokenSymbol?: string
    sellTokenDecimals?: number
    sellTokenSupply?: number
    sellTokenDeposit: number
    /**
     * @description maximum sell
     */
    maxSellPercent: number
    buyTokenContract: string
    buyTokenName?: string
    buyTokenSymbol?: string
    buyTokenDecimals?: number
    buyTokenSupply?: number
  }) {
    return requestAdapter<{}>({
      url: replacePath('/cores/crowdfunding', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'crowdfunding@crowdfundable-startups'(args?: any) {
    return requestAdapter<
      {
        startupId: number
        startupName: string
        /**
         * @description 能否募资：true,可，false,不能
         */
        canRaise: boolean
        tokenContract?: string
      }[]
    >({
      url: replacePath('/cores/startups/crowdfundable', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },
  'crowdfunding@crowdfunding-investments'(
    args: {
      crowdfundingId: any
    } & {
      page: number
    }
  ) {
    return requestAdapter<{
      limit: number
      page: number
      totalPages: number
      totalRows: number
      rows: {
        crowdfundingId: number
        startupId: number
        comerAvatar: string
        comerName: string
        amount: number
        access: number
        time: string
      }[]
    }>({
      url: replacePath('/cores/crowdfundings/:crowdfundingId/investments', args),
      method: 'POST',
      ...extract('POST', args, [], ['crowdfundingId'])
    })
  },
  'crowdfunding@detail'(args: { crowdfundingId: any }) {
    return requestAdapter<{
      crowdfundingId: number
      chainId: number
      crowdfundingContract: string
      teamWallet: string
      sellTokenContract: string
      sellTokenName: string
      sellTokenDecimals: number
      sellTokenSupply: number
      maxSellPercent: number
      maxBuyAmount: number
      buyTokenContract: string
      sellTax: number
      buyPrice: number
      swapPercent: number
      raiseBalance: number
      raiseGoal: number
      raisedPercent: number
      startupId: number
      comerId: number
      startTime: string
      endTime: string
      poster: string
      youtube: string
      detail: string
      description: string
      status: number
    }>({
      url: replacePath('/cores/crowdfundings/:crowdfundingId', args),
      method: 'GET',
      ...extract('GET', args, [], ['crowdfundingId'])
    })
  },
  'crowdfunding@ibo-rate-histories'(
    args: {
      crowdfundingId: any
    } & {
      /**
       * @example 1
       */
      page: any
    }
  ) {
    return requestAdapter<{
      limit: number
      page: number
      totalPages: number
      totalRows: number
      rows: {
        crowdfundingId: number
        startTime: string
        buyTokenSymbol: string
        sellTokenSymbol: string
        buyPrice: number
        swapPercent: number
      }[]
    }>({
      url: replacePath('/cores/crowdfundings/:crowdfundingId/histories', args),
      method: 'GET',
      ...extract('GET', args, ['page'], ['crowdfundingId'])
    })
  },
  'crowdfunding@invest-crowdfunding'(
    args: {
      crowdfundingId: any
    } & {
      txHash: string
      /**
       * @description 1-买入，2-卖出
       */
      access: number
      buyTokenSymbol: string
      buyTokenAmount: number
      sellTokenSymbol: string
      sellTokenAmount: number
      price: number
    }
  ) {
    return requestAdapter<{}>({
      url: replacePath('/cores/crowdfundings/:crowdfundingId/invest', args),
      method: 'POST',
      ...extract('POST', args, [], ['crowdfundingId'])
    })
  },
  'crowdfunding@modify-crowdfunding'(
    args: {
      crowdfundingId: any
    } & {
      /**
       * @description 如果没有修改下面任一值，不需要和合约交互
       */
      txHash?: string
      swapPercent?: number
      buyPrice?: string
      maxBuyAmount?: number
      maxSellPercent?: number
      endTime?: string
    }
  ) {
    return requestAdapter<{}>({
      url: replacePath('/cores/crowdfundings/:crowdfundingId/modify', args),
      method: 'PUT',
      ...extract('PUT', args, [], ['crowdfundingId'])
    })
  },
  'crowdfunding@participated-crowdfunding-list'(args: {
    page: number
    limit?: number
    /**
     * @description 暂时不支持搜索
     */
    keyword?: string
  }) {
    return requestAdapter<{
      limit: number
      page: number
      totalPages: number
      totalRows: number
      rows: {
        crowdfundingId: number
        crowdfundingContract: string
        startupId: number
        comerId: number
        startupName: string
        startupLogo: string
        raiseBalance: number
        raisedPercent: number
        buyTokenSymbol: string
        buyTokenAmount: number
        status: number
      }[]
    }>({
      url: replacePath('/cores/crowdfundings/participated', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'crowdfunding@posted-crowdfunding-list'(args: {
    page: number
    limit?: number
    /**
     * @description 暂时不支持搜索
     */
    keyword?: string
  }) {
    return requestAdapter<{
      limit: number
      page: number
      totalPages: number
      totalRows: number
      rows: {
        crowdfundingId: number
        /**
         * @description 合约地址
         */
        crowdfundingContract: string
        startupId: number
        comerId: number
        startupName: string
        startupLogo: string
        startTime: string
        endTime: string
        raiseBalance: number
        raisedPercent: number
        status: number
      }[]
    }>({
      url: replacePath('/cores/crowdfundings/posted', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'crowdfunding@public-crowdfunding-list'(args: {
    page: number
    limit?: number
    /**
     * @description 1,2,3,4
     */
    mode?: number
    keyword?: string
  }) {
    return requestAdapter<{
      limit: number
      page: number
      totalPages: number
      totalRows: number
      rows: {
        crowdfundingId: number
        /**
         * @description 合约地址
         */
        crowdfundingContract: string
        startupId: number
        comerId: number
        startupName: string
        startTime: string
        endTime: string
        raiseBalance: number
        raiseGoal: number
        raisedPercent: number
        buyPrice: number
        swapPercent: number
        poster: string
        status: number
        kyc?: string
        chainId: number
        contractAudit?: string
        buyTokenAddress: string
        sellTokenAddress: string
      }[]
    }>({
      url: replacePath('/cores/crowdfundings', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  },
  'crowdfunding@remove-crowdfunding'(
    args: {
      crowdfundingId: any
    } & {
      txHash: string
    }
  ) {
    return requestAdapter<{}>({
      url: replacePath('/cores/crowdfundings/:crowdfundingId/remove', args),
      method: 'POST',
      ...extract('POST', args, [], ['crowdfundingId'])
    })
  },

  'startup@change-comer-group'(
    args: {
      startupID: any
      groupID: any
      comerID: any
    } & {}
  ) {
    return requestAdapter<
      {
        id: number
        name: number
        comerName: string
        comerAvatar: string
        groupId: number
        groupName: string
        joinedTime: string
      }[]
    >({
      url: replacePath('/cores/startups/:startupID/group/:groupID/member/:comerID', args),
      method: 'POST',
      ...extract('POST', args, [], ['startupID', 'groupID', 'comerID'])
    })
  },
  'startup@create-group'(
    args: {
      startupID: any
    } & {
      name: string
    }
  ) {
    return requestAdapter<{}>({
      url: replacePath('/cores/startups/:startupID/groups', args),
      method: 'POST',
      ...extract('POST', args, [], ['startupID'])
    })
  },
  'startup@delete-group'(
    args: {
      groupID: any
    } & {}
  ) {
    return requestAdapter<{}>({
      url: replacePath('/cores/startups/group/:groupID', args),
      method: 'DELETE',
      ...extract('DELETE', args, [], ['groupID'])
    })
  },
  'startup@social-add-or-update'(args: { startupID: any }) {
    return requestAdapter<{
      /**
   * @description 	1-SocialEmail 
	2-SocialWebsite
	3-SocialTwitter
	4-SocialDiscord
	5-SocialTelegram
	6-SocialMedium
	7-SocialFacebook
	8-SocialLinktre
     */
      socialType: number
      /**
       * @description 为空表示删除值
       */
      socialLink?: string
    }>({
      url: replacePath('/cores/startups/:startupID/social', args),
      method: 'POST',
      ...extract('POST', args, [], ['startupID'])
    })
  },
  'startup@social-delete'(args: { startupID: any }) {
    return requestAdapter<{
      /**
   * @description 	1-SocialEmail 
	2-SocialWebsite
	3-SocialTwitter
	4-SocialDiscord
	5-SocialTelegram
	6-SocialMedium
	7-SocialFacebook
	8-SocialLinktre
     */
      socialType: number
    }>({
      url: replacePath('/cores/startups/:startupID/social', args),
      method: 'DELETE',
      ...extract('DELETE', args, [], ['startupID'])
    })
  },
  'startup@startup-get'(args: { startupId: any }) {
    return requestAdapter<{
      id: number
      createdAt: string
      updatedAt: string
      isDeleted: boolean
      comerID: number
      name: string
      /**
       * @description 1:ESG,2:NGO,3:DAO,4:COM
       */
      mode: number
      logo: string
      /**
       * @description 封面
       */
      cover: string
      mission: string
      tokenContractAddress: string
      overview: string
      chainID: number
      blockChainAddress: string
      isSet: boolean
      kyc: string
      contractAudit: string
      hashTags: {
        id: number
        createdAt: string
        updatedAt: string
        isDeleted: boolean
        name: string
        category: string
        isIndex: boolean
      }[]
      website: string
      discord: string
      twitter: string
      telegram: string
      docs: string
      launchNetwork: number
      tokenName: string
      tokenSymbol: string
      totalSupply: number
      presaleStart: string
      presaleEnd: string
      launchDate: string
      /**
       * @description 标签展示顺序
       */
      tabSequence: number[]
      wallets: {
        id: number
        createdAt: string
        updatedAt: string
        isDeleted: boolean
        comerID: number
        startupID: number
        walletName: string
        walletAddress: string
      }[]
      memberCount: number
      followCount: number
    }>({
      url: replacePath('/cores/startups/{startupId}', args),
      method: 'GET',
      ...extract('GET', args, [], ['startupId'])
    })
  },
  'startup@startup-group-list'(
    args: {
      startupID: any
    } & {}
  ) {
    return requestAdapter<
      {
        id: number
        name: string
        startupId: number
        comerId: number
      }[]
    >({
      url: replacePath('/cores/startups/group/:startupID/groups', args),
      method: 'GET',
      ...extract('GET', args, [], ['startupID'])
    })
  },
  'startup@startup-group-member-list'(
    args: {
      groupID: any
    } & {}
  ) {
    return requestAdapter<
      {
        id: number
        name: number
        comerName: string
        comerAvatar: string
        groupId: number
        groupName: string
        joinedTime: string
      }[]
    >({
      url: replacePath('/cores/startups/group/:groupID/members', args),
      method: 'GET',
      ...extract('GET', args, [], ['groupID'])
    })
  },
  'startup@startup-list-createdBy-comer'(args: { comerID: any }) {
    return requestAdapter<{
      list: {
        startupId: number
        comerId: number
        updatedAt: string
        isFollowed: boolean
      }[]
      total: number
    }>({
      url: replacePath('/cores//startups/comer/:comerID', args),
      method: 'GET',
      ...extract('GET', args, [], ['comerID'])
    })
  },
  'startup@update-cover'(
    args: {
      startupID: any
    } & {
      image: string
    }
  ) {
    return requestAdapter<any>({
      url: replacePath('/cores/startups/:startupID/cover', args),
      method: 'POST',
      ...extract('POST', args, [], ['startupID'])
    })
  },
  'startup@update-security'(
    args: {
      startupID: any
    } & {
      kyc: string
      contractAudit: string
    }
  ) {
    return requestAdapter<{}>({
      url: replacePath('/cores/startups/:startupID/security', args),
      method: 'POST',
      ...extract('POST', args, [], ['startupID'])
    })
  },
  'startup@update-sequnce'(
    args: {
      startupID: any
    } & {
      tabs: number[]
    }
  ) {
    return requestAdapter<{}>({
      url: replacePath('/cores/startups/:startupID/sequence', args),
      method: 'POST',
      ...extract('POST', args, [], ['startupID'])
    })
  },
  'startup@startup-list'(args: {
    limit: any
    offset?: any
    keyword?: any
    /**
     * @description NONE,ESG,NGO,DAO,COM
     */
    mode?: any
  }) {
    return requestAdapter<{
      list: {
        id: number
        createdAt: string
        updatedAt: string
        isDeleted: boolean
        comerID: number
        name: string
        /**
         * @description 1:ESG,2:NGO,3:DAO,4:COM
         */
        mode: number
        logo: string
        mission: string
        tokenContractAddress: string
        overview: string
        chainID: number
        blockChainAddress: string
        isSet: boolean
        kyc: string
        contractAudit: string
        hashTags: {
          id: number
          createdAt: string
          updatedAt: string
          isDeleted: boolean
          name: string
          category: string
          isIndex: boolean
        }[]
        website: string
        discord: string
        twitter: string
        telegram: string
        docs: string
        launchNetwork: number
        tokenName: string
        tokenSymbol: string
        totalSupply: number
        presaleStart: string
        presaleEnd: string
        launchDate: string
        wallets: {
          id: number
          createdAt: string
          updatedAt: string
          isDeleted: boolean
          comerID: number
          startupID: number
          walletName: string
          walletAddress: string
        }[]
        memberCount: number
        followCount: number
      }[]
      total: number
    }>({
      url: replacePath('/cores/startups', args),
      method: 'GET',
      ...extract('GET', args, ['limit', 'offset', 'keyword', 'mode'], [])
    })
  },
  'startup@startup-list-me'(args: {
    limit: any
    offset?: any
    keyword?: any
    /**
     * @description NONE,ESG,NGO,DAO,COM
     */
    mode?: any
  }) {
    return requestAdapter<{
      list: {
        id: number
        createdAt: string
        updatedAt: string
        isDeleted: boolean
        comerID: number
        name: string
        /**
         * @description NONE,ESG,NGO,DAO,COM
         */
        mode: string
        logo: string
        mission: string
        chainID: number
        blockChainAddress: string
        tokenContractAddress: string
        isSet: boolean
        wallets: {
          id: number
          createdAt: string
          updatedAt: string
          isDeleted: boolean
          comerID: number
          startupID: number
          walletName: string
          walletAddress: string
        }[]
        memberCount: number
        followCount: number
      }[]
      total: number
    }>({
      url: replacePath('/cores/startups/me', args),
      method: 'GET',
      ...extract('GET', args, ['limit', 'offset', 'keyword', 'mode'], [])
    })
  },
  'startup@startup-follow'(args: {
    /**
     * @example 1
     */
    startupId: any
  }) {
    return requestAdapter<{}>({
      url: replacePath('/cores/startups/{startupId}/follow', args),
      method: 'POST',
      ...extract('POST', args, [], ['startupId'])
    })
  },
  'startup@startup-unfollow'(args: {
    /**
     * @example 1
     */
    startupId: any
  }) {
    return requestAdapter<{}>({
      url: replacePath('/cores/startups/{startupId}/unfollow', args),
      method: 'DELETE',
      ...extract('DELETE', args, [], ['startupId'])
    })
  },
  'startup@startup-list-followed'(args: {
    limit: any
    offset: any
    keyword: any
    /**
     * @description NONE,ESG,NGO,DAO,COM
     */
    mode: any
  }) {
    return requestAdapter<{
      list: {
        id: number
        createdAt: string
        updatedAt: string
        isDeleted: boolean
        comerID: number
        name: string
        /**
         * @description NONE,ESG,NGO,DAO,COM
         */
        mode: string
        logo: string
        mission: string
        chainID: number
        blockChainAddress: string
        tokenContractAddress: string
        isSet: boolean
        kyc: string
        contractAudit: string
        hashTags: {
          id: number
          createdAt: string
          updatedAt: string
          isDeleted: boolean
          name: string
          category: string
          isIndex: boolean
        }[]
        website: string
        discord: string
        twitter: string
        telegram: string
        docs: string
        launchNetwork: number
        tokenName: string
        tokenSymbol: string
        totalSupply: string
        presaleStart: string
        presaleEnd: string
        launchDate: string
        wallets: {
          id: number
          createdAt: string
          updatedAt: string
          isDeleted: boolean
          comerID: number
          startupID: number
          walletName: string
          walletAddress: string
        }[]
      }[]
      total: number
    }>({
      url: replacePath('/cores/startups/follow', args),
      method: 'GET',
      ...extract('GET', args, ['limit', 'offset', 'keyword', 'mode'], [])
    })
  },
  'startup@startup-name-is-exist'(args: { name: any }) {
    return requestAdapter<{
      isExist: boolean
    }>({
      url: replacePath('/cores/startups/name/:name/isExist', args),
      method: 'GET',
      ...extract('GET', args, [], ['name'])
    })
  },
  'startup@startup-token-contract-is-exist'(args: { tokenContract: any }) {
    return requestAdapter<{
      isExist: boolean
    }>({
      url: replacePath('/cores/startups/tokenContract/:tokenContract/isExist', args),
      method: 'GET',
      ...extract('GET', args, [], ['tokenContract'])
    })
  },
  'startup@start-team-meabers-list'(
    args: {
      startupId: any
    } & {
      limit: any
      offset: any
    }
  ) {
    return requestAdapter<{
      list: {
        ID: number
        CreatedAt: string
        UpdatedAt: string
        comerID: number
        startupID: number
        position: string
        comer?: {
          id: number
          createdAt: string
          updatedAt: string
          isDeleted: boolean
          Address: string
        }
        comerProfile?: {
          id: number
          createdAt: string
          updatedAt: string
          isDeleted: boolean
          comerID: number
          name: string
          avatar: string
          location: string
          website: string
          bio: string
          skills?: any
        }
      }[]
      total: number
    }>({
      url: replacePath('/cores/startups/{startupId}/teamMembers', args),
      method: 'GET',
      ...extract('GET', args, ['limit', 'offset'], ['startupId'])
    })
  },
  'startup@start-team-meabers-create'(
    args: {
      startupId: any
      comerId: any
    } & {
      position: string
    }
  ) {
    return requestAdapter<{}>({
      url: replacePath('/cores/startups/{startupId}/teamMembers/{comerId}', args),
      method: 'POST',
      ...extract('POST', args, [], ['startupId', 'comerId'])
    })
  },
  'startup@start-team-meabers-update'(
    args: {
      startupId: any
      comerId: any
    } & {
      position: string
    }
  ) {
    return requestAdapter<{}>({
      url: replacePath('/cores/startups/{startupId}/teamMembers/{comerId}', args),
      method: 'PUT',
      ...extract('PUT', args, [], ['startupId', 'comerId'])
    })
  },
  'startup@start-team-meabers-delete'(
    args: {
      startupId: any
      comerId: any
    } & {}
  ) {
    return requestAdapter<{}>({
      url: replacePath('/cores/startups/{startupId}/teamMembers/{comerId}', args),
      method: 'DELETE',
      ...extract('DELETE', args, [], ['startupId', 'comerId'])
    })
  },
  'startup@startup-basic-setting-update'(
    args: {
      startupId: any
    } & {
      kyc: string
      contractAudit: string
      hashTags: string[]
      website: string
      discord: string
      twitter: string
      telegram: string
      docs: string
    }
  ) {
    return requestAdapter<{}>({
      url: replacePath('/cores/startups/{startupId}/basicSetting', args),
      method: 'PUT',
      ...extract('PUT', args, [], ['startupId'])
    })
  },
  'startup@startup-finance-setting-update'(
    args: {
      startupId: any
    } & {
      tokenContractAddress: string
      launchNetwork: number
      tokenName: string
      tokenSymbol: string
      totalSupply: number
      presaleStart: string
      presaleEnd: string
      launchDate: string
      wallets: {
        walletName: string
        walletAddress: string
      }[]
    }
  ) {
    return requestAdapter<{}>({
      url: replacePath('/cores/startups/{startupId}/financeSetting', args),
      method: 'PUT',
      ...extract('PUT', args, [], ['startupId'])
    })
  },
  'startup@startup-list-participated'(args: {
    limit: any
    offset: any
    keyword: any
    /**
     * @description NONE,ESG,NGO,DAO,COM
     */
    mode: any
  }) {
    return requestAdapter<{
      list: {
        id: number
        createdAt: string
        updatedAt: string
        isDeleted: boolean
        comerID: number
        name: string
        /**
         * @description NONE,ESG,NGO,DAO,COM
         */
        mode: string
        logo: string
        mission: string
        chainID: number
        blockChainAddress: string
        tokenContractAddress: string
        isSet: boolean
        wallets: {
          id: number
          createdAt: string
          updatedAt: string
          isDeleted: boolean
          comerID: number
          startupID: number
          walletName: string
          walletAddress: string
        }[]
      }[]
      total: number
    }>({
      url: replacePath('/cores/startups/participate', args),
      method: 'GET',
      ...extract('GET', args, ['limit', 'offset', 'keyword', 'mode'], [])
    })
  },
  'startup@startup-followed-by-me'(args: { startupId: any }) {
    return requestAdapter<{
      isFollowed: boolean
    }>({
      url: replacePath('/cores/startups/{startupId}/followedByMe', args),
      method: 'GET',
      ...extract('GET', args, [], ['startupId'])
    })
  },
  'startup@startup-list-be-member'(
    args: {
      comerId: any
    } & {
      limit: any
      offset: any
      keyword?: any
      /**
       * @description NONE,ESG,NGO,DAO,COM
       */
      mode?: any
    }
  ) {
    return requestAdapter<{
      list: {
        id: number
        createdAt: string
        updatedAt: string
        isDeleted: boolean
        comerID: number
        name: string
        /**
         * @description NONE,ESG,NGO,DAO,COM
         */
        mode: string
        logo: string
        mission: string
        chainID: number
        blockChainAddress: string
        tokenContractAddress: string
        isSet: boolean
        overview: string
        kyc: string
        contractAudit: string
        hashTags: {
          id: number
          createdAt: string
          updatedAt: string
          isDeleted: boolean
          name: string
          category: string
          isIndex: boolean
        }[]
        website: string
        discord: string
        twitter: string
        telegram: string
        docs: string
        launchNetwork: number
        tokenName: string
        tokenSymbol: string
        totalSupply: number
        presaleStart: string
        presaleEnd: string
        launchDate: string
        wallets: {
          id: number
          createdAt: string
          updatedAt: string
          isDeleted: boolean
          comerID: number
          startupID: number
          walletName: string
          walletAddress: string
        }[]
        members: {
          id: number
          createdAt: string
          updatedAt: string
          comerID: number
          startupID: number
          position: string
          comer?: {
            id: number
            createdAt: string
            updatedAt: string
            isDeleted: boolean
            address: string
          }
          comerProfile?: {
            id: number
            createdAt: string
            updatedAt: string
            isDeleted: boolean
            comerID: number
            name: string
            avatar: string
            location: string
            timeZone: string
            website: string
            email: string
            twitter: string
            discord: string
            telegram: string
            medium: string
            bio: string
            skills: string[]
          }
        }[]
        memberCount: number
        follows: {
          id: number
          createdAt: string
          updatedAt: string
          comerID: number
          startupID: number
        }[]
        followCount: number
      }[]
      total: number
    }>({
      url: replacePath('/cores/startups/member/{comerId}', args),
      method: 'GET',
      ...extract('GET', args, ['limit', 'offset', 'keyword', 'mode'], ['comerId'])
    })
  },
  'startup@startup-list-me_copy'(args: {
    limit: any
    offset?: any
    keyword?: any
    /**
     * @description NONE,ESG,NGO,DAO,COM
     */
    mode?: any
  }) {
    return requestAdapter<{
      list: {
        id: number
        createdAt: string
        updatedAt: string
        isDeleted: boolean
        comerID: number
        name: string
        /**
         * @description NONE,ESG,NGO,DAO,COM
         */
        mode: string
        logo: string
        mission: string
        tokenContractAddress: string
        isSet: boolean
        wallets: {
          id: number
          createdAt: string
          updatedAt: string
          isDeleted: boolean
          comerID: number
          startupID: number
          walletName: string
          walletAddress: string
        }[]
      }[]
      total: number
    }>({
      url: replacePath('/cores/startups/me_1651049855443', args),
      method: 'GET',
      ...extract('GET', args, ['limit', 'offset', 'keyword', 'mode'], [])
    })
  },

  'meta@image-list'(args: {
    /**
     * @description 0～100
     */
    limit: any
    /**
     * @description &gt;0
     */
    offset: any
    /**
     * @description avatar
     * @example avatar
     */
    category: any
  }) {
    return requestAdapter<{
      list: {
        id: number
        createdAt: string
        updatedAt: string
        isDeleted: boolean
        name: string
        /**
         * @description avatar
         */
        category: string
      }[]
      total: number
    }>({
      url: replacePath('/meta/images', args),
      method: 'GET',
      ...extract('GET', args, ['limit', 'offset', 'category'], [])
    })
  },
  'meta@tag-list'(args: {
    /**
     * @description true,false
     * @example false
     */
    isIndex: any
    /**
     * @description 0～100
     */
    limit: any
    /**
     * @description &gt;0
     */
    offset: any
    /**
     * @description comerSkill;startup;bounty
     * @example comerSkill
     */
    category: any
    /**
     * @example a
     */
    keyword: any
  }) {
    return requestAdapter<{
      list: {
        id: number
        createdAt: string
        updatedAt: string
        isDeleted: boolean
        name: string
        category: string
        isIndex: boolean
      }[]
      total: number
    }>({
      url: replacePath('/meta/tags', args),
      method: 'GET',
      ...extract('GET', args, ['isIndex', 'limit', 'offset', 'category', 'keyword'], [])
    })
  },

  'template@error'(args?: any) {
    return requestAdapter<{
      code: number
      message: string
      data?: {}
    }>({
      url: replacePath('/error', args),
      method: 'GET',
      ...extract('GET', args, [], [])
    })
  },

  'misc@file-upload'(
    args: // file : File
    FormData
  ) {
    return requestAdapter<{
      url: string
    }>({
      url: replacePath('/misc/upload', args),
      method: 'POST',
      ...extract('POST', args, [], [])
    })
  }
}

export type ServiceKeys = keyof typeof services

export type ServiceArg<T extends ServiceKeys> = Parameters<typeof services[T]>[0]

export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T

export type ServiceReturn<T extends ServiceKeys> = Awaited<ReturnType<typeof services[T]>>['data']
