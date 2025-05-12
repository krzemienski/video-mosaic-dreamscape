
#!/bin/bash

# Build preparation script for awesome.video
# Usage: ./deploy.sh

echo "Preparing build for Vercel deployment..."

# Ensure correct Node.js version
export NODE_VERSION=16.x

# Install dependencies
echo "Installing dependencies..."
npm install

# Generate favicons and meta images
echo "Generating favicons and meta images..."
node scripts/generate-favicons.js

# Build the project
echo "Building the project..."
npm run build

echo "Build preparation complete! The site is ready for deployment."
echo "Vercel will automatically deploy the site when you push to the repository."
echo "Your site will be live at https://awesome.video"
