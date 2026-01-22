import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  // Initialize auth state listener
  const initAuth = () => {
    return new Promise<void>((resolve) => {
      onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          user.value = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          }
        } else {
          user.value = null
        }
        loading.value = false
        resolve()
      })
    })
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      error.value = null
      loading.value = true
      const result = await signInWithPopup(auth, googleProvider)
      user.value = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      }
      return result.user
    } catch (err: unknown) {
      error.value = (err as Error).message || 'Failed to sign in'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Sign out
  const logout = async () => {
    try {
      error.value = null
      await signOut(auth)
      user.value = null
    } catch (err: unknown) {
      error.value = (err as Error).message || 'Failed to sign out'
      throw err
    }
  }

  return {
    user,
    loading,
    error,
    initAuth,
    signInWithGoogle,
    logout,
  }
})
