/* eslint-disable */
import { requestAdapter } from './a2s.adapter'
import { extract, replacePath } from './a2s.utils'

export const services = {
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
      location?: string
      timeZone: string
      website?: string
      email: string
      twitter: string
      discord: string
      telegram: string
      medium: string
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
    }>({
      url: replacePath('/cores/startups/{startupId}', args),
      method: 'GET',
      ...extract('GET', args, [], ['startupId'])
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
