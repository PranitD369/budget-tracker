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
    // Process redirect result first, then let onAuthStateChanged handle the rest.
    // Errors here (e.g. unauthorized domain) are surfaced instead of swallowed.
    getRedirectResult(auth).catch((err) => {
      setAuthError(err.message)
      setLoading(false)
    })

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        const ref = doc(db, 'users', user.uid)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          setUserProfile(snap.data())
        } else {
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
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function signInWithGoogle() {
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
