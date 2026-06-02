import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUser(null)
        setUserProfile(null)
        setLoading(false)
        return
      }

      const ref = doc(db, 'users', user.uid)
      const snap = await getDoc(ref)
      let profile
      if (snap.exists()) {
        profile = snap.data()
      } else {
        profile = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          familyId: null,
          createdAt: serverTimestamp(),
        }
        await setDoc(ref, profile)
      }

      // Set all three together so React batches into one render.
      // If setCurrentUser fired before this, FamilyRoute would see
      // userProfile=null and redirect to /setup on every login.
      setCurrentUser(user)
      setUserProfile(profile)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function signUp(name, email, password) {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(user, { displayName: name })
    const profile = {
      uid: user.uid,
      displayName: name,
      email: user.email,
      photoURL: null,
      familyId: null,
      createdAt: serverTimestamp(),
    }
    await setDoc(doc(db, 'users', user.uid), profile)
    setUserProfile(profile)
  }

  async function signIn(email, password) {
    await signInWithEmailAndPassword(auth, email, password)
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
    <AuthContext.Provider value={{ currentUser, userProfile, loading, signUp, signIn, signOut, refreshUserProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
