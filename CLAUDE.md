# CourtIQ — Agent Notes

Context for Claude (or any AI agent) working on this codebase. Read this
**first** before making changes — there are real foot-guns documented
below that have already burned hours of debug time.

---

## What this is

Mobile-first basketball performance tracker. **Vite + React** PWA on
the web (`www.getcourtiq.com`), wrapped in **Capacitor** for native iOS
(`com.pivottraining.courtiq`). Auth + DB are **Supabase**.

- Web: deployed via Vercel from branch `claude/setup-courtiq-project-10DLD`
  on the `PivotTraining/ChrisMarvel` repo. Project: `courtiq`
  (`prj_sKRdF7jCvDWoe7seNPXM3Wct8md4`), team
  `team_kfS6bZADxwe1xsKYqPhOoJQP`.
- iOS: bundle `com.pivottraining.courtiq`, dev team `V92KUXH2QK`
  (Chris Davis), distributed via App Store Connect TestFlight.

There is a **second Vercel project** (`court-iq-deploy`, Next.js stub)
that historically served the domain. Do not put anything there. The
domain belongs to the `courtiq` Vite project.

---

## ⚠️ Foot-guns to avoid

### 1. AuthContext can deadlock the entire app

`src/context/AuthContext.jsx` calls `supabase.auth.getSession()` on
mount and waits for `.then()` to fire before setting `loading = false`.
If `getSession()` ever fails to resolve (we've seen it happen with
stale `sb-*` tokens stuck in the local refresh path), the
`AuthProvider` `loading` state stays `true` forever and `App.jsx`
renders only the `<h1>CourtIQ</h1>` + spinner loading screen.

**The fix is already in the codebase**: there's a 5-second `Promise.race`
timeout around `getSession()` that wipes stale tokens and falls through
to the login screen if it doesn't resolve in time. **Do not remove it.**
If you need to refactor AuthContext, keep the timeout.

The symptom is unmistakable: `document.getElementById('root').innerText`
returns exactly `"CourtIQ"` (7 chars), `querySelectorAll('*').length`
is exactly **6**. That's the auth-loading state, not React Suspense
fallback.

### 2. The persistence pattern in useGames.js

`src/hooks/useGames.js` uses **localStorage as the source of truth** and
Supabase as a best-effort sync layer.

- `addGame()`: writes to localStorage **first** with a
  client-generated id, then attempts the Supabase insert. Supabase
  errors are logged via `console.warn` and **never thrown** — the
  localStorage write is what counts. If Supabase succeeds, the local
  row is replaced with the canonical server row.
- `fetchGames()`: loads localStorage, then attempts a Supabase fetch,
  then merges by id (remote wins on conflict). Persists the merged
  set back to localStorage.

This pattern exists because the production code path used to be
**Supabase-only** with a silent `catch {}` block, which silently
dropped games when the `games` table was missing or RLS blocked
inserts. That was the actual root cause of "stats lost" complaints.

**Do not remove the localStorage path.** Even if the Supabase tables
exist and RLS is set up correctly, the localStorage primary pattern
makes the app work offline and survive any backend hiccup.

### 3. BYPASS_AUTH branches still exist

`src/lib/supabase.js` exports `BYPASS_AUTH = import.meta.env.VITE_BYPASS_AUTH === 'true'`.
Several hooks (`useGames`, `useShots`, `AuthContext`) still have
`if (BYPASS_AUTH) { ... } else { ... }` branches. Leave them. They're
the local dev shortcut and removing them broke things in a previous
attempt.

### 4. Service worker reload loop (already fixed)

`src/main.jsx` listens for `controllerchange` to reload the page when
a new service worker takes over. The naive version reloaded
unconditionally, which on a **first visit** fires immediately because
workbox's `clientsClaim` hands control over right away → infinite
reload loop → "spinner forever" bug.

The current code only reloads when there was a **previously
controlling** SW (i.e. a returning user with a stale bundle), and
guards with `sessionStorage.courtiq_sw_reloaded` so a single session
can never reload more than once. **Do not simplify this.**

### 5. My IQ is read-only by design

`src/pages/shots/Shots.jsx` (the My IQ page) **must not have any
"Start Gametime" CTAs**. It is purely a read-only aggregation of
saved game data. Users start games from the Gametime tab in the
bottom nav. The empty state has descriptive copy but no action button.

### 6. Vite config gotchas

- The Vercel project's "Production Branch" was historically NOT set,
  so pushes to `claude/setup-courtiq-project-10DLD` went to preview
  only. We have to **manually `npx vercel promote <id>`** every commit.
- The Vercel project framework is set to `nestjs` (wrong) but it
  builds fine with Vite anyway. Don't change it without testing.
- Vite env vars (`VITE_*`) are baked into the bundle at build time,
  not runtime. The Supabase URL + anon key are **hardcoded as
  fallbacks** in `src/lib/supabase.js` so the app survives bad/missing
  Vercel env vars. The anon key is public by design (RLS protects data).

### 7. iOS build identity mismatch

The committed `ios/App/App.xcodeproj/project.pbxproj` has:
- `PRODUCT_BUNDLE_IDENTIFIER = "com.pivottraining.courtiq"`
- `DEVELOPMENT_TEAM = V92KUXH2QK`

CLI archiving works with these. **Do NOT** change them to
`9MXNAR2Y89` — that's a signing certificate ID, not a team ID, and
the CLI can't auth to it. (We made this mistake in a prior session.)

The bundle ID for the Capacitor URL scheme is different: the deep
link callback uses `com.courtiq.app://login-callback` (registered in
`Info.plist`). Don't conflate these two.

---

## Repo layout

```
src/
  context/
    AuthContext.jsx         ← has the 5s timeout race, leave it
    PremiumContext.jsx      ← LOCAL_PROMO_CODES whitelist for free Pro
    ToastContext.jsx
    OfflineContext.jsx
    LinkingContext.jsx
  hooks/
    useGames.js             ← localStorage primary, Supabase best-effort
    useShots.js             ← session-scoped shot logging (still
                              Supabase-only in prod branch — TODO:
                              apply same pattern as useGames)
    useDrills.js
  lib/
    supabase.js             ← hardcoded URL + JWT key fallbacks
    insights.js             ← Claude AI coach edge function client
  pages/
    home/Home.jsx           ← Quick Actions match the 4 nav tabs
    quickgame/QuickGame.jsx ← Gametime: court SVG, save → addGame
    shots/Shots.jsx         ← My IQ — READ ONLY, no CTAs
    games/Games.jsx         ← Game Log, exists at /games but NOT in nav
    drills/Drills.jsx
    training/Training.jsx
    practice/Practice.jsx   ← Pro-gated
    journal/Journal.jsx
    settings/Settings.jsx
    premium/Premium.jsx
    auth/{Login,Signup,Onboarding}.jsx
  components/
    layout/BottomNav.jsx    ← 4 tabs: Home, Gametime, Drills, My IQ
    layout/Header.jsx
    ui/GameShareCard.jsx    ← html-to-image PNG capture, navigator.share
    ui/UpgradePrompt.jsx    ← onUpgrade callback, doesn't unmount parent
  main.jsx                  ← service worker reload guard
  App.jsx                   ← AuthProvider gates everything

ios/
  App/
    App.xcodeproj/          ← project file, V92KUXH2QK, com.pivottraining.courtiq
    App/Info.plist          ← com.courtiq.app:// URL scheme for OAuth
    ci_scripts/
      ci_post_clone.sh      ← Xcode Cloud build script, hardcodes
                              Supabase creds, runs npm + cap sync
```

---

## Common workflows

### Bumping iOS build number
```bash
cd ios/App && xcrun agvtool new-version -all <N>
```
Always increment past whatever's already in App Store Connect, otherwise
the upload will be rejected as a duplicate.

### Archiving + uploading iOS via CLI
The Xcode UI is the most reliable for the upload step. CLI for archive,
UI for distribute:

```bash
# 1. Build the web layer with the latest code
npm run build && npx cap sync ios

# 2. Bump build number
cd ios/App && xcrun agvtool new-version -all <N>

# 3. Archive via xcodebuild (CLI)
xcodebuild archive -project App.xcodeproj -scheme App \
  -configuration Release -archivePath /tmp/courtiq-build/App.xcarchive \
  -destination "generic/platform=iOS" -allowProvisioningUpdates

# 4. Copy archive into Xcode Organizer location so it shows in UI
cp -R /tmp/courtiq-build/App.xcarchive \
  ~/Library/Developer/Xcode/Archives/$(date +%Y-%m-%d)/

# 5. Open Xcode → Window → Organizer → Archives → select latest
#    → Distribute App → App Store Connect → Distribute
```

After upload, App Store Connect takes 15–30 min to process the build
before it appears in TestFlight or is selectable in the App Store
submission form.

### Promoting Vercel deploys
The branch's pushes go to preview, NOT production, even though we set
the production branch in the Vercel UI multiple times. To actually
ship to www.getcourtiq.com:

```bash
# After pushing, find the new deployment id
# (use list_deployments via Vercel MCP or `vercel ls`)

# Promote it (will prompt y/n — pipe in y)
echo "y" | npx vercel promote <DEPLOYMENT_ID> --scope pivot-trainings-projects
```

This creates a new deployment via the production environment and
aliases www.getcourtiq.com to it.

### Verifying live bundle hash
```bash
curl -s https://www.getcourtiq.com | grep -o 'index-[A-Za-z0-9_-]*\.js'
```

---

## Debugging recipes

### "Page is stuck on the CourtIQ loading screen"
```js
// In the browser console:
JSON.stringify({
  text: document.getElementById('root').innerText,
  elementCount: document.getElementById('root').querySelectorAll('*').length,
  authToken: !!localStorage.getItem('sb-tkjvkvrzlvbukxbsilvw-auth-token'),
})
```
- 7 chars + 6 elements = auth-loading screen. AuthContext is hung.
  The 5s timeout should have rescued it; if not, something regressed.
  Workaround: clear `sb-*` keys from localStorage, reload.
- More chars = page actually rendered. Problem is downstream.
- **Always test the same scenario on the previous deploy before
  blaming your latest change.** The auth hang predates the
  persistence fix and we wasted ~3 hours rolling back the wrong thing.

### "Stats are lost when I save a game"
```js
JSON.parse(localStorage.getItem('courtiq_games') || '[]')
```
If this returns the saved game → write side works, problem is in the
read path (Shots.jsx aggregation).
If this returns `[]` → addGame silently failed. Check console for
`[CourtIQ] Supabase games insert skipped` warnings.

### Console messages from useGames
The `tryFetchRemoteGames` and related helpers all log via
`console.warn('[CourtIQ] ...')` on failure. Filter the console for
`CourtIQ` to see exactly which Supabase call is failing and why.

---

## Open follow-ups

- **`useShots.js` still has the Supabase-only production branch.**
  Apply the same localStorage-primary pattern as `useGames.js`. Low
  priority because shots are bundled inside the saved game record
  (`game._shots`), so they survive via `useGames`.
- **The `profiles` / `games` / `shots` Supabase tables and RLS
  policies** may or may not exist + be correctly configured. The app
  works fine without them now (localStorage takes the load) but
  cross-device sync won't work until they're set up. SQL migration
  needs to be run by hand at:
  `https://supabase.com/dashboard/project/tkjvkvrzlvbukxbsilvw/sql/new`
- **`AuthContext.fetchProfile`** still reads from `profiles` table
  which may not exist. Currently fails silently and sets
  `profile = null`, so the UI falls back to placeholder values
  ("Player" instead of the user's actual name). Fix once the
  `profiles` table exists.

---

## Lessons learned (do not repeat)

1. **Test the rollback the same way you tested the fix.** Don't
   assume "the old code worked before, so it'll work now" — bisect
   the actual symptom against the actual previous state.
2. **Confirmation bias kills.** I shipped two rollbacks in a row
   blaming `useGames.js` for an auth hang that was sitting in
   `AuthContext` the entire time. The diagnosis was wrong because I
   only tested the fix's symptom against itself.
3. **Smaller diffs are easier to debug.** When something does go
   wrong, you can `git diff` your way out faster.
4. **`console.warn` everything in best-effort code paths.** Silent
   `catch {}` blocks are the actual root cause of most "data
   disappeared" bug reports.
5. **localStorage is your friend.** When the backend is
   under-provisioned (missing tables, broken RLS), client-side
   persistence keeps the app usable instead of silently throwing
   user data away.
