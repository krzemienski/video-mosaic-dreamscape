# Video Mosaic Dreamscape

## Project Overview

This project is a video mosaic application that organizes and displays video content in a clean, navigable interface.

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Local Development

### Prerequisites

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Setup

Follow these steps:

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd video-mosaic-dreamscape

# Step 3: Install the necessary dependencies
npm install

# Step 4: Start the development server with auto-reloading and an instant preview
npm run dev
```

### Building for Production

To build the project for production:

```sh
npm run build
```

The built files will be in the `dist` directory.

## Deployment

### Deploying to Vercel

This project is configured for easy deployment to Vercel.

#### Option 1: Direct Deployment

1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` in the project root
3. Follow the prompts to set up and deploy your project

#### Option 2: Connecting to GitHub

1. Push your project to GitHub
2. Go to [Vercel](https://vercel.com) and sign in
3. Click "Add New" > "Project"
4. Connect to your GitHub account and select the repository
5. Configure the project settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click "Deploy"

### Custom Domains

After deploying to Vercel, you can easily add a custom domain:

1. Go to your project dashboard in Vercel
2. Navigate to "Settings" > "Domains"
3. Add your domain and follow the instructions for verification
