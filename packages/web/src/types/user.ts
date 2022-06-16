export interface UserProfileState {
  // token: string
  avatar: string
  name: string
  isProfiled?: boolean
  location?: string
  website?: string
  skills: string[]
  timeZone: string
  email: string
  bio: string
  twitter?: string
  discord?: string
  telegram?: string
  medium?: string
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
  comerID: number
  oauthLinked: boolean
  oauthAccountId: number
}
