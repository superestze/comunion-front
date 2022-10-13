import { ComerAccount } from '@/components/OAuth/Link/OAuthLinkWidget'

interface Skill {
  id?: number
  createdAt?: string
  updatedAt?: string
  isDeleted?: boolean
  name?: string
  isIndex?: boolean
}

export interface UserProfileState {
  // token: string
  comerID?: number
  avatar?: string
  cover?: string
  name?: string
  isProfiled?: boolean
  location?: string
  website?: string
  skills?: Skill[]
  timeZone?: string
  email?: string
  bio?: string
  twitter?: string
  discord?: string
  telegram?: string
  medium?: string
  facebook?: string
  linktree?: string
  languages?: {
    language: string
    level: string
  }[]
  educations?: {
    school: string
    major: string
    graduatedAt: string
  }[]
  comerAccounts?: {
    linked: boolean
    accountType: number
    accountId?: number
  }[]
  oauth?: {
    github?: string
    google?: string
  }
  walletAddress?: string
}

export interface UserResponse
  extends Omit<UserProfileState, 'oauth' | 'walletAddress' | 'isProfiled'> {
  address?: string
  nick?: string
  token: string
  isProfiled: boolean
  comerId: number
  oauthLinked: boolean
  oauthAccountId: number
  firstLogin: boolean
  comerAccounts: ComerAccount[]
}
