import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithRedirect, getRedirectResult, signOut as firebaseSignOut } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '../lib/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    console.log('[Auth] init — calling getRedirectResult')
    getRedirectResult(auth)
      .then((result) => {
        console.log('[Auth] getRedirectResult resolved — user:', result?.user?.email ?? 'null (no redirect in progress)')
      })
      .catch((err) => {
        console.error('[Auth] getRedirectResult error:', err.code, err.message)
        setAuthError(`${err.code}: ${err.message}`)
        setLoading(false)
      })

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('[Auth] onAuthStateChanged fired — user:', user?.email ?? 'null')
      setCurrentUser(user)
      if (user) {
        const ref = doc(db, 'users', user.uid)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          console.log('[Auth] user profile loaded — familyId:', snap.data().familyId)
          setUserProfile(snap.data())
        } else {
          console.log('[Auth] new user — creating profile')
          const profile = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            familyId: null,
            createdAt: serverTimestamp(),
          }
          await setDoc(ref, profile)
          setUserProfile(profile)
        }
      } else {
        setUserProfile(null)
      }
      console.log('[Auth] setLoading(false)')
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function signInWithGoogle() {
    console.log('[Auth] signInWithRedirect — starting')
    setAuthError(null)
    await signInWithRedirect(auth, googleProvider)
  }

  async function signOut() {
    await firebaseSignOut(auth)
  }

  async function refreshUserProfile() {
    if (!currentUser) return
    const snap = await getDoc(doc(db, 'users', currentUser.uid))
    if (snap.exists()) setUserProfile(snap.data())
  }

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading, authError, signInWithGoogle, signOut, refreshUserProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
