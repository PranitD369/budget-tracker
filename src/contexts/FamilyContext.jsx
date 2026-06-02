import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
  collection, doc, onSnapshot, addDoc, setDoc, updateDoc, deleteDoc, getDocs,
  serverTimestamp, query, where, orderBy,
} from 'firebase/firestore'
import { format } from 'date-fns'
import { db } from '../lib/firebase'
import { useAuth } from './AuthContext'

const FamilyContext = createContext(null)

const DEFAULT_CATEGORIES = [
  { name: 'Food', color: '#f59e0b', icon: '🍔', isCustom: false },
  { name: 'Transport', color: '#3b82f6', icon: '🚗', isCustom: false },
  { name: 'Housing', color: '#8b5cf6', icon: '🏠', isCustom: false },
  { name: 'Health', color: '#10b981', icon: '❤️', isCustom: false },
  { name: 'Entertainment', color: '#ec4899', icon: '🎬', isCustom: false },
  { name: 'Shopping', color: '#f97316', icon: '🛍️', isCustom: false },
  { name: 'Utilities', color: '#6366f1', icon: '💡', isCustom: false },
  { name: 'Other', color: '#6b7280', icon: '📦', isCustom: false },
]

export function FamilyProvider({ children }) {
  const { currentUser, userProfile, refreshUserProfile } = useAuth()
  const [familyDoc, setFamilyDoc] = useState(null)
  const [members, setMembers] = useState([])
  const [categories, setCategories] = useState([])
  const [monthlyExpenses, setMonthlyExpenses] = useState([])
  const [budgets, setBudgetsState] = useState([])
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'yyyy-MM'))
  const [loading, setLoading] = useState(true)

  const familyId = userProfile?.familyId

  useEffect(() => {
    if (!familyId) {
      setLoading(false)
      return
    }

    setLoading(true)
    const unsubs = []

    unsubs.push(onSnapshot(doc(db, 'families', familyId), (snap) => {
      setFamilyDoc(snap.exists() ? { id: snap.id, ...snap.data() } : null)
    }))

    unsubs.push(onSnapshot(collection(db, 'families', familyId, 'members'), (snap) => {
      setMembers(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }))

    unsubs.push(onSnapshot(collection(db, 'families', familyId, 'categories'), (snap) => {
      setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }))

    setLoading(false)

    return () => unsubs.forEach(u => u())
  }, [familyId])

  useEffect(() => {
    if (!familyId) return

    const expQ = query(
      collection(db, 'families', familyId, 'expenses'),
      where('month', '==', currentMonth),
      orderBy('date', 'desc'),
    )
    const unsub1 = onSnapshot(expQ, (snap) => {
      setMonthlyExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })

    const budQ = query(
      collection(db, 'families', familyId, 'budgets'),
      where('month', '==', currentMonth),
    )
    const unsub2 = onSnapshot(budQ, (snap) => {
      setBudgetsState(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })

    return () => { unsub1(); unsub2() }
  }, [familyId, currentMonth])

  const addExpense = useCallback(async ({ amount, category, note }) => {
    if (!familyId || !currentUser) return
    const month = format(new Date(), 'yyyy-MM')
    await addDoc(collection(db, 'families', familyId, 'expenses'), {
      uid: currentUser.uid,
      displayName: currentUser.displayName,
      photoURL: currentUser.photoURL,
      amount: parseFloat(amount),
      category,
      note: note || '',
      date: serverTimestamp(),
      month,
    })
  }, [familyId, currentUser])

  const addCategory = useCallback(async ({ name, color, icon }) => {
    if (!familyId) return
    await addDoc(collection(db, 'families', familyId, 'categories'), {
      name,
      color,
      icon,
      isCustom: true,
      createdBy: currentUser.uid,
      createdAt: serverTimestamp(),
    })
  }, [familyId, currentUser])

  const setBudget = useCallback(async (uid, limit) => {
    if (!familyId) return
    const docId = `${uid}_${currentMonth}`
    await setDoc(doc(db, 'families', familyId, 'budgets', docId), {
      uid,
      month: currentMonth,
      limit: parseFloat(limit),
      updatedAt: serverTimestamp(),
    }, { merge: true })
  }, [familyId, currentMonth])

  const createFamily = useCallback(async (name) => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    const famRef = await addDoc(collection(db, 'families'), {
      name,
      createdBy: currentUser.uid,
      inviteCode: code,
      createdAt: serverTimestamp(),
    })
    const memberData = {
      uid: currentUser.uid,
      displayName: currentUser.displayName,
      email: currentUser.email,
      photoURL: currentUser.photoURL,
      role: 'admin',
      joinedAt: serverTimestamp(),
    }
    await setDoc(doc(db, 'families', famRef.id, 'members', currentUser.uid), memberData)
    for (const cat of DEFAULT_CATEGORIES) {
      await addDoc(collection(db, 'families', famRef.id, 'categories'), cat)
    }
    await updateDoc(doc(db, 'users', currentUser.uid), { familyId: famRef.id })
    await refreshUserProfile()
  }, [currentUser, refreshUserProfile])

  const joinFamily = useCallback(async (inviteCode) => {
    const snap = await getDocs(query(collection(db, 'families'), where('inviteCode', '==', inviteCode.toUpperCase())))
    if (snap.empty) throw new Error('Invalid invite code')
    const famId = snap.docs[0].id
    await setDoc(doc(db, 'families', famId, 'members', currentUser.uid), {
      uid: currentUser.uid,
      displayName: currentUser.displayName,
      email: currentUser.email,
      photoURL: currentUser.photoURL,
      role: 'member',
      joinedAt: serverTimestamp(),
    })
    await updateDoc(doc(db, 'users', currentUser.uid), { familyId: famId })
    await refreshUserProfile()
  }, [currentUser, refreshUserProfile])

  const deleteExpense = useCallback(async (expenseId) => {
    if (!familyId) return
    await deleteDoc(doc(db, 'families', familyId, 'expenses', expenseId))
  }, [familyId])

  const allCategories = [...DEFAULT_CATEGORIES.filter(d =>
    !categories.some(c => c.name === d.name)
  ), ...categories]

  return (
    <FamilyContext.Provider value={{
      familyDoc, members, categories: allCategories, monthlyExpenses, budgets,
      currentMonth, setCurrentMonth, loading,
      addExpense, addCategory, setBudget, createFamily, joinFamily, deleteExpense,
    }}>
      {children}
    </FamilyContext.Provider>
  )
}

export function useFamily() {
  return useContext(FamilyContext)
}
