import { useState, useEffect } from 'react'
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../contexts/AuthContext'
import type { FocusSession, StreakData } from '../types'

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

function diffDays(a: string, b: string) {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000)
}

function computeStreak(sessions: FocusSession[]): StreakData {
  if (sessions.length === 0) {
    return { currentStreak: 0, longestStreak: 0, lastSessionDate: null }
  }

  // Unique dates sorted descending
  const dates = [...new Set(sessions.map((s) => s.date))].sort((a, b) =>
    b.localeCompare(a),
  )

  const today = todayStr()
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  // Current streak only counts if last session was today or yesterday
  let currentStreak = 0
  if (dates[0] === today || dates[0] === yesterday) {
    currentStreak = 1
    for (let i = 1; i < dates.length; i++) {
      if (diffDays(dates[i], dates[i - 1]) === 1) {
        currentStreak++
      } else break
    }
  }

  // Longest streak
  let longest = 1,
    run = 1
  const asc = [...dates].reverse()
  for (let i = 1; i < asc.length; i++) {
    if (diffDays(asc[i - 1], asc[i]) === 1) {
      run++
      longest = Math.max(longest, run)
    } else {
      run = 1
    }
  }

  return {
    currentStreak,
    longestStreak: Math.max(longest, currentStreak),
    lastSessionDate: dates[0] ?? null,
  }
}

function computeWeeklyMinutes(sessions: FocusSession[]): number {
  const weekAgo = new Date(Date.now() - 7 * 86400000)
    .toISOString()
    .split('T')[0]
  return sessions
    .filter((s) => s.date >= weekAgo)
    .reduce((acc, s) => acc + Math.floor(s.actualDuration / 60), 0)
}

export function useSessions() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<FocusSession[]>([])
  const [loading, setLoading] = useState(true)
  const [streak, setStreak] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastSessionDate: null,
  })
  const [totalMinutes, setTotalMinutes] = useState(0)
  const [weeklyMinutes, setWeeklyMinutes] = useState(0)

  useEffect(() => {
    if (!user) return
    const load = async () => {
      const q = query(
        collection(db, 'users', user.uid, 'sessions'),
        orderBy('completedAt', 'desc'),
      )
      const snap = await getDocs(q)
      const data: FocusSession[] = snap.docs.map((d) => {
        const raw = d.data()
        const completedAt =
          raw.completedAt instanceof Timestamp
            ? raw.completedAt.toDate().toISOString()
            : raw.completedAt
        return { id: d.id, ...raw, completedAt } as FocusSession
      })
      setSessions(data)
      setStreak(computeStreak(data))
      setTotalMinutes(
        data.reduce((acc, s) => acc + Math.floor(s.actualDuration / 60), 0),
      )
      setWeeklyMinutes(computeWeeklyMinutes(data))
      setLoading(false)
    }
    load()
  }, [user])

  const addSession = async (
    session: Omit<FocusSession, 'id'>,
  ): Promise<void> => {
    if (!user) return
    const ref = await addDoc(collection(db, 'users', user.uid, 'sessions'), {
      ...session,
      completedAt: Timestamp.fromDate(new Date(session.completedAt)),
    })
    const newSession: FocusSession = { id: ref.id, ...session }
    const updated = [newSession, ...sessions]
    setSessions(updated)
    setStreak(computeStreak(updated))
    setTotalMinutes(
      updated.reduce((acc, s) => acc + Math.floor(s.actualDuration / 60), 0),
    )
    setWeeklyMinutes(computeWeeklyMinutes(updated))
  }

  return { sessions, loading, addSession, streak, totalMinutes, weeklyMinutes }
}
