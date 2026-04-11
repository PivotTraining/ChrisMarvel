// LinkingContext — parent/child account linking via short-lived 6-digit codes.
//
// Flow:
//   • A parent opens Settings → "Family Linking" → "Generate code". We mint a
//     6-character alphanumeric code, store it in localStorage under
//     `courtiq_link_codes` with the parent user id and an expiry, and show it.
//   • The child opens Settings on their device → "Link to parent" → enters the
//     code. We look up the code, mark the child profile's `linked_parent_id`,
//     push the child id into the parent's `linked_children` array, and burn
//     the code so it can't be reused.
//
// Everything is localStorage-backed to work in BYPASS_AUTH. In real Supabase
// mode this maps to a `family_links` table and an `edge_function` that mints
// codes server-side — the shape of the context is intentionally the same so
// the UI doesn't change when we flip modes.

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'

const CODES_KEY = 'courtiq_link_codes'
const LINKS_KEY = 'courtiq_family_links'
const CODE_TTL_MS = 30 * 60 * 1000  // 30 minutes

function loadCodes() {
  try { return JSON.parse(localStorage.getItem(CODES_KEY) || '{}') } catch { return {} }
}
function saveCodes(c) {
  try { localStorage.setItem(CODES_KEY, JSON.stringify(c)) } catch { /* noop */ }
}
function loadLinks() {
  try { return JSON.parse(localStorage.getItem(LINKS_KEY) || '{}') } catch { return {} }
}
function saveLinks(l) {
  try { localStorage.setItem(LINKS_KEY, JSON.stringify(l)) } catch { /* noop */ }
}

function generateCode() {
  // 6-char alphanumeric, avoiding easily-confused chars
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return code
}

function purgeExpired(codes) {
  const now = Date.now()
  const fresh = {}
  Object.entries(codes).forEach(([k, v]) => {
    if (v && v.expiresAt > now) fresh[k] = v
  })
  return fresh
}

const LinkingContext = createContext(null)

export function LinkingProvider({ children }) {
  const { user, profile, updateProfile } = useAuth()
  const [, bump] = useState(0)
  const rerender = () => bump(x => x + 1)

  const links = useMemo(() => loadLinks(), [])

  const myLink = useMemo(() => {
    if (!user?.id) return null
    return links[user.id] || { children: [], parentId: null }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  // Generate a new code bound to the current user (as the parent).
  const mintCode = useCallback(() => {
    if (!user?.id) return null
    const codes = purgeExpired(loadCodes())
    let code
    do { code = generateCode() } while (codes[code])
    codes[code] = {
      ownerId: user.id,
      ownerEmail: user.email || '',
      ownerName: profile?.full_name || '',
      expiresAt: Date.now() + CODE_TTL_MS,
    }
    saveCodes(codes)
    rerender()
    return { code, expiresAt: codes[code].expiresAt }
  }, [user?.id, user?.email, profile?.full_name])

  // Redeem a code entered by the child account.
  const redeemCode = useCallback(async (rawCode) => {
    if (!user?.id) return { ok: false, error: 'Not signed in' }
    const code = (rawCode || '').trim().toUpperCase().replace(/-/g, '')
    if (code.length !== 6) return { ok: false, error: 'Code must be 6 characters' }
    const codes = purgeExpired(loadCodes())
    const entry = codes[code]
    if (!entry) return { ok: false, error: 'Invalid or expired code' }
    if (entry.ownerId === user.id) return { ok: false, error: 'That\'s your own code' }

    // Write the family link both directions
    const freshLinks = loadLinks()
    const parentRecord = freshLinks[entry.ownerId] || { children: [], parentId: null }
    if (!parentRecord.children.includes(user.id)) parentRecord.children.push(user.id)
    freshLinks[entry.ownerId] = parentRecord

    const childRecord = freshLinks[user.id] || { children: [], parentId: null }
    childRecord.parentId = entry.ownerId
    freshLinks[user.id] = childRecord
    saveLinks(freshLinks)

    // Burn the code
    delete codes[code]
    saveCodes(codes)

    // Also mirror parentId onto profile so the Home screen can show it
    try { await updateProfile?.({ linked_parent_id: entry.ownerId, linked_parent_name: entry.ownerName || entry.ownerEmail }) } catch { /* noop */ }

    rerender()
    return { ok: true, parent: { id: entry.ownerId, name: entry.ownerName, email: entry.ownerEmail } }
  }, [user?.id, updateProfile])

  const unlink = useCallback(async () => {
    if (!user?.id) return
    const freshLinks = loadLinks()
    const me = freshLinks[user.id] || { children: [], parentId: null }
    // If I'm a child — remove me from my parent's children list
    if (me.parentId) {
      const parentRecord = freshLinks[me.parentId]
      if (parentRecord) {
        parentRecord.children = parentRecord.children.filter(cid => cid !== user.id)
        freshLinks[me.parentId] = parentRecord
      }
      me.parentId = null
    }
    // If I'm a parent — detach all my children
    if (me.children?.length) {
      me.children.forEach(cid => {
        const childRecord = freshLinks[cid]
        if (childRecord) {
          childRecord.parentId = null
          freshLinks[cid] = childRecord
        }
      })
      me.children = []
    }
    freshLinks[user.id] = me
    saveLinks(freshLinks)
    try { await updateProfile?.({ linked_parent_id: null, linked_parent_name: null }) } catch { /* noop */ }
    rerender()
  }, [user?.id, updateProfile])

  const value = {
    myChildren: myLink?.children || [],
    myParentId: myLink?.parentId || null,
    mintCode,
    redeemCode,
    unlink,
  }

  return <LinkingContext.Provider value={value}>{children}</LinkingContext.Provider>
}

export function useLinking() {
  const ctx = useContext(LinkingContext)
  if (!ctx) throw new Error('useLinking must be used within a LinkingProvider')
  return ctx
}
