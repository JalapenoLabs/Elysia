// Copyright © 2024 Elysia

// Core
import { useEffect, useState } from 'react'
import { Replicator } from './replication'
import EventEmitter from 'events'

// Default values
import { DEFAULT_LANGUAGE } from '@/constants'

// /////////////////// //
//    Profile Shape    //
// /////////////////// //
export type Profile = {
  language: string
  metronome: boolean
}

export const DEFAULT_PROFILE: Profile = {
  language: DEFAULT_LANGUAGE,
  metronome: true
}

// /////////////////// //
//    Inner workings   //
// /////////////////// //

type ProfileEventMap = {
  'change': [ Readonly<Profile> ]
}

class UserProfile extends EventEmitter<ProfileEventMap> {
  private static PROFILE_KEY = 'profile' as const
  private static replicator = new Replicator<Profile>('UserProfile')

  // Cache
  private cache: Readonly<Profile>

  constructor() {
    super()
    UserProfile.replicator.on(
      'replication',
      async (latest) => {
        // This should have already been saved by the other tab that emitted it!
        // Saving it would be pointless :)
        // await localStore.setItem(
        //   UserProfile.PROFILE_KEY,
        //   latest
        // )
        this.emitChange(latest)
      }
    )
    // When the tab becomes paused, it may not get updates from the worker
    // Recheck & restore the cache upon window visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        console.log('Page visibility updated, rechecking profile cache')
        // The page has become visible (unpaused)
        this.emitChange(
          this.get(true)
        )
      }
      else {
        // The page has been hidden or paused
      }
    })
  }

  // //////////////////// //
  //    Public utility    //
  // //////////////////// //

  public get(noCache: boolean = false): Readonly<Profile> {
    if (this.cache && !noCache) {
      return this.cache
    }
    const profile = localStorage.getItem(UserProfile.PROFILE_KEY)
    if (profile) {
      const asJSON = JSON.parse(profile)
      this.cache = Object.freeze(asJSON)
      return asJSON
    }
    this.cache = Object.freeze({ ...DEFAULT_PROFILE })
    return this.cache
  }

  public set<Key extends keyof Profile>(key: Key, value: Profile[Key]): Profile {
    const newConfig: Profile = {
      ...this.get(),
      [key]: value
    }
    localStorage.setItem(
      UserProfile.PROFILE_KEY,
      JSON.stringify(newConfig)
    )
    this.emitChange(newConfig)
    UserProfile.replicator.publish(newConfig, 'profile-changed')
    this.cache = Object.freeze(newConfig)
    return newConfig
  }

  // //////////////////// //
  //    Private utility   //
  // //////////////////// //

  private emitChange(latest: Profile): void {
    this.emit(
      'change',
      Object.freeze(latest)
    )
  }
}

export const userProfile = new UserProfile()

export function useProfile<Key extends keyof Profile>(
  key: Key
): [
  Profile[Key],
  (value: Profile[Key]) => void
] {
  const [ value, setProfileValue ] = useState(userProfile.get())

  useEffect(() => {
    const listener = (latest: Readonly<Profile>) => {
      setProfileValue(latest)
    }
    userProfile.on('change', listener)
    return () => {
      userProfile.off('change', listener)
    }
  }, [])

  return [ value[key], (value) => userProfile.set(key, value) ]
}
