#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# CourtIQ — one-shot Mac setup & run script
#
# Usage (on the Mac mini, after cloning the repo):
#   cd ChrisMarvel
#   bash scripts/mac-run.sh
#
# What it does:
#   1. Verifies prerequisites (macOS, git, Node 20+, Xcode command-line tools)
#   2. Checks out the feature branch and pulls latest
#   3. Installs npm dependencies
#   4. Creates .env.local from the template if missing
#   5. Builds the web app (vite)
#   6. Syncs the build into the iOS Xcode project (capacitor)
#   7. Opens the Xcode workspace so you can hit ▶ to run the simulator
#
# You only need to touch .env.local once — fill in your Supabase keys there.
# -----------------------------------------------------------------------------

set -euo pipefail

BRANCH="claude/setup-courtiq-project-10DLD"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# Color helpers
BOLD=$(tput bold 2>/dev/null || echo "")
DIM=$(tput dim 2>/dev/null || echo "")
GREEN=$(tput setaf 2 2>/dev/null || echo "")
RED=$(tput setaf 1 2>/dev/null || echo "")
YELLOW=$(tput setaf 3 2>/dev/null || echo "")
RESET=$(tput sgr0 2>/dev/null || echo "")

say()  { printf "%s\n" "${BOLD}${GREEN}==>${RESET} ${BOLD}$*${RESET}"; }
warn() { printf "%s\n" "${BOLD}${YELLOW}!!${RESET} $*"; }
fail() { printf "%s\n" "${BOLD}${RED}xx${RESET} $*" >&2; exit 1; }

# -----------------------------------------------------------------------------
# 1. Prerequisites
# -----------------------------------------------------------------------------
say "Checking prerequisites"

[[ "$(uname)" == "Darwin" ]] || fail "This script must run on macOS. Current: $(uname)"

command -v git >/dev/null 2>&1 || fail "git not found. Install Xcode command-line tools: xcode-select --install"

if ! command -v node >/dev/null 2>&1; then
  fail "node not found. Install Node 20+ via nvm or https://nodejs.org"
fi
NODE_MAJOR=$(node -v | sed -E 's/v([0-9]+).*/\1/')
if (( NODE_MAJOR < 20 )); then
  fail "Node 20+ required. Current: $(node -v)"
fi

if ! xcode-select -p >/dev/null 2>&1; then
  fail "Xcode command-line tools not installed. Run: xcode-select --install"
fi

if ! command -v xcodebuild >/dev/null 2>&1; then
  warn "xcodebuild not found — install the full Xcode from the App Store, then run:"
  warn "    sudo xcode-select -s /Applications/Xcode.app/Contents/Developer"
  warn "    sudo xcodebuild -runFirstLaunch"
fi

printf "    %s Node %s\n" "${DIM}·${RESET}" "$(node -v)"
printf "    %s npm %s\n" "${DIM}·${RESET}" "$(npm -v)"
printf "    %s git %s\n" "${DIM}·${RESET}" "$(git --version | awk '{print $3}')"
printf "    %s Xcode CLI: $(xcode-select -p)\n" "${DIM}·${RESET}"

# -----------------------------------------------------------------------------
# 2. Branch & pull
# -----------------------------------------------------------------------------
say "Syncing branch: $BRANCH"

git fetch origin "$BRANCH"
CURRENT=$(git rev-parse --abbrev-ref HEAD)
if [[ "$CURRENT" != "$BRANCH" ]]; then
  git checkout "$BRANCH" || git checkout -b "$BRANCH" "origin/$BRANCH"
fi
git pull --ff-only origin "$BRANCH" || warn "Could not fast-forward — resolve manually if needed"

# -----------------------------------------------------------------------------
# 3. npm install
# -----------------------------------------------------------------------------
say "Installing JS dependencies"
if [[ -f package-lock.json ]]; then
  npm ci || npm install
else
  npm install
fi

# -----------------------------------------------------------------------------
# 4. .env.local
# -----------------------------------------------------------------------------
if [[ ! -f .env.local ]]; then
  say "Creating .env.local stub (fill in your Supabase keys)"
  cat > .env.local <<'ENVEOF'
# CourtIQ environment variables — fill these in, then rerun scripts/mac-run.sh
# Get these from https://app.supabase.com/project/<your-project>/settings/api
VITE_SUPABASE_URL=https://iopntnrycwbhpqclbulm.supabase.co
VITE_SUPABASE_ANON_KEY=

# Optional — enables embedded Stripe Checkout. Without it the Premium page
# falls back to the hosted payment link (which works fine for testing).
VITE_STRIPE_PUBLISHABLE_KEY=
ENVEOF
  warn ".env.local created. Open it, paste VITE_SUPABASE_ANON_KEY, save, then rerun this script."
  warn "Quick path: pbpaste > /tmp/x && open -t .env.local"
  exit 0
fi

if ! grep -q "VITE_SUPABASE_ANON_KEY=.\+" .env.local; then
  warn "VITE_SUPABASE_ANON_KEY looks empty in .env.local — the app will run with the BYPASS_AUTH fallback only."
fi

# -----------------------------------------------------------------------------
# 5. Build web app
# -----------------------------------------------------------------------------
say "Building web app (vite)"
npm run build

# -----------------------------------------------------------------------------
# 6. Capacitor sync
# -----------------------------------------------------------------------------
say "Syncing web build into ios/ (capacitor)"
npx cap sync ios

# -----------------------------------------------------------------------------
# 7. Open Xcode
# -----------------------------------------------------------------------------
say "Opening Xcode workspace"
npx cap open ios

cat <<'DONE'

------------------------------------------------------------------------
  Xcode should now be opening.

  Next steps inside Xcode:
    1. Wait for "Resolving package dependencies" to finish (~30s first run)
    2. Top bar — pick a simulator (iPhone 15 Pro is a good default)
    3. Hit the ▶ Play button (or Cmd+R)
    4. The CourtIQ splash appears, then the app

  To rebuild after editing source files:
    npm run cap:sync     # rebuilds dist + copies into ios/
    Then hit ▶ again in Xcode.

  To see console logs from the running app:
    Xcode → View → Debug Area → Activate Console
------------------------------------------------------------------------

DONE
