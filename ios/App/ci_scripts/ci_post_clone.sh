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

# Write Supabase env vars from Xcode Cloud environment variables
# Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in App Store Connect → Xcode Cloud → Environment
cat > .env.local <<EOF
VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
EOF

# Build the web app
echo "Building web app..."
npm run build

# Sync into iOS
echo "Syncing to iOS..."
npx cap sync ios

echo "=== Pre-build complete ==="
