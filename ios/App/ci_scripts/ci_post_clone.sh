#!/bin/sh
# Xcode Cloud pre-build script
# Runs after the repo is cloned — installs Node deps, builds the web app,
# and syncs the output into the iOS project before Xcode compiles.

set -e

echo "=== CourtIQ Xcode Cloud pre-build ==="

# Install Node via Homebrew if not present
if ! command -v node &> /dev/null; then
  echo "Installing Node.js..."
  brew install node
fi

echo "Node: $(node -v)  npm: $(npm -v)"

# Move to the project root (two levels up from ios/App/ci_scripts)
cd "$CI_PRIMARY_REPOSITORY_PATH"

# Install dependencies
echo "Installing npm dependencies..."
npm ci --prefer-offline || npm install

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
npm run build

# Sync into iOS
echo "Syncing to iOS..."
npx cap sync ios

echo "=== Pre-build complete ==="
