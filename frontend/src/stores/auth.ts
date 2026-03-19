import { writable } from 'svelte/store'
import type { User } from 'firebase/auth'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

// undefined = not yet resolved, null = signed out, User = signed in
export const currentUser = writable<User | null | undefined>(undefined)

export function initAuth(): Promise<void> {
  return new Promise(resolve => {
    let resolved = false
    onAuthStateChanged(auth, user => {
      currentUser.set(user)
      if (!resolved) {
        resolved = true
        resolve()
      }
    })
  })
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider()
  await signInWithPopup(auth, provider)
}

export async function signOut() {
  await firebaseSignOut(auth)
  localStorage.removeItem('motolog_last_sync')
}
