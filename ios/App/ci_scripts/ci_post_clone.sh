#!/bin/sh
# Xcode Cloud pre-build script
# Runs after the repo is cloned — installs Node deps, builds the web app,
# and syncs the output into the iOS project before Xcode compiles.

set -e

echo "=== CourtIQ Xcode Cloud pre-build ==="

# Prevent Homebrew auto-update — it produces no stdout for 10+ minutes
# which triggers Xcode Cloud's 15-minute inactivity timeout.
export HOMEBREW_NO_AUTO_UPDATE=1
export HOMEBREW_NO_INSTALL_CLEANUP=1
export HOMEBREW_NO_ENV_HINTS=1

# Install Node via Homebrew if not present
if ! command -v node &> /dev/null; then
  echo "Installing Node.js via Homebrew (auto-update disabled)..."
  brew install node
  echo "Node installed successfully."
fi

echo "Node: $(node -v)  npm: $(npm -v)"

# Move to the project root (two levels up from ios/App/ci_scripts)
cd "$CI_PRIMARY_REPOSITORY_PATH"

# Install dependencies (use --loglevel verbose so Xcode Cloud sees stdout
# activity and doesn't hit the 15-minute inactivity timeout).
echo "Installing npm dependencies..."
npm ci --prefer-offline --loglevel verbose 2>&1 || npm install --loglevel verbose 2>&1

# Write env vars — use Xcode Cloud env vars if set, otherwise fall back to
# the production values so the build always has real Supabase credentials.
# The anon key is intentionally public (it is safe to commit).
RESOLVED_SUPABASE_URL="${VITE_SUPABASE_URL:-https://tkjvkvrzlvbukxbsilvw.supabase.co}"
RESOLVED_SUPABASE_ANON_KEY="${VITE_SUPABASE_ANON_KEY:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRranZrdnJ6bHZidWt4YnNpbHZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MjIyMzQsImV4cCI6MjA5MTQ5ODIzNH0.ebLBIuzir8oVH_tLKqW7VV_RTQEbwT1LpfMe6vsc4VQ}"

cat > .env.local <<EOF
VITE_SUPABASE_URL=${RESOLVED_SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${RESOLVED_SUPABASE_ANON_KEY}
VITE_BYPASS_AUTH=false
EOF

echo "Supabase URL: ${RESOLVED_SUPABASE_URL}"
echo "Bypass auth: false"

# Build the web app
echo "Building web app..."
npm run build 2>&1
echo "Web build complete."

# Sync into iOS
echo "Syncing to iOS..."
npx cap sync ios 2>&1
echo "iOS sync complete."

echo "=== Pre-build complete ==="
