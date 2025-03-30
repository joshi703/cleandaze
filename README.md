# Maid Service Booking Platform

A modern, interactive platform for booking maid services, designed with a clean user interface and responsive design. This application allows users to browse available maids, book services, join a waitlist, and includes an admin dashboard for service management.

## Features

- User registration and authentication
- Waitlist system for new users
- Maid service booking functionality
- Maid registration and management
- Admin dashboard for service oversight
- Responsive design for all devices

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS, shadcn/ui
- Backend: Node.js, Express
- State Management: TanStack Query (React Query)
- Form Handling: React Hook Form with Zod validation
- Authentication: Passport.js
- Animation: Framer Motion

## Deployment Options

### Replit Deployment

This application is configured to run on Replit:

1. Fork the Repl
2. Click the Run button to start the development server
3. The application will be available at the URL provided by Replit

To deploy to production on Replit:
1. Navigate to the "Deployments" tab in your Repl
2. Click "Deploy to production"
3. Your application will be available at `yourapp.replit.app`

### Vercel Deployment

Follow these steps to deploy the application to Vercel:

1. **Create a Vercel Account**
   - Sign up at [vercel.com](https://vercel.com)

2. **Prepare Your Repository**
   - Push this codebase to a Git repository (GitHub, GitLab, or Bitbucket)

3. **Connect to Vercel**
   - Log in to Vercel
   - Click "Add New Project"
   - Import your repository
   - Select the branch to deploy (usually `main` or `master`)

4. **Configure Build Settings**
   - Build command: `./vercel-build.sh`
   - Output directory: `dist`
   - Install command: `npm install`

5. **Set Environment Variables**
   - In Vercel dashboard, go to Project Settings > Environment Variables
   - Add the environment variables from `.env.example`
   - Make sure to set `SESSION_SECRET` to a secure value
   - Set `VITE_VERCEL_DEPLOYMENT` to `true`

6. **Deploy**
   - Click "Deploy"
   - Wait for the build and deployment to complete

7. **Verify Deployment**
   - Check that all routes are working
   - Test authentication functionality
   - Test the waitlist and booking features
   
8. **Troubleshooting Deployment Issues**
   - **Function Errors**: Check the Function logs in the Vercel dashboard
   - **Build Failures**: Review build logs for errors in the build process
   - **Missing Environment Variables**: Ensure all required environment variables are set
   - **API 404 Errors**: Verify your API routes in vercel.json are correctly configured

### Netlify Deployment

Follow these steps to deploy the application to Netlify:

1. **Create a Netlify Account**
   - Sign up at [netlify.com](https://www.netlify.com)

2. **Prepare Your Repository**
   - Push this codebase to a Git repository (GitHub, GitLab, or Bitbucket)

3. **Connect to Netlify**
   - Log in to Netlify
   - Click "New site from Git"
   - Select your repository
   - Select the branch to deploy (usually `main` or `master`)

4. **Configure Build Settings**
   - Build command: `./netlify-build.sh`
   - Publish directory: `dist`

5. **Set Environment Variables**
   - In Netlify dashboard, go to Site settings > Build & deploy > Environment
   - Add the environment variables from `.env.example`
   - Make sure to set `SESSION_SECRET` to a secure value
   - Leave `VITE_VERCEL_DEPLOYMENT` unset or set to `false`

6. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete

7. **Verify Deployment**
   - Check that all routes are working
   - Test authentication functionality
   - Test the waitlist and booking features
   
8. **Troubleshooting Deployment Issues**
   - **Function Invocation Failed**: Check the function logs for detailed error messages
   - **Build Failures**: Review Netlify build logs for errors in the build process
   - **Missing Environment Variables**: Ensure all required environment variables are set in the Netlify dashboard
   - **API 404 Errors**: Verify your redirects in netlify.toml are correctly configured
   - **Function Size Limit Exceeded**: If you encounter this, try optimizing dependencies and code splitting

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open [http://localhost:5000](http://localhost:5000) in your browser

## Project Structure

- `client/` - Frontend React application
- `server/` - Express backend
- `shared/` - Shared types and schemas
- `functions/` - Serverless functions for Netlify and Vercel
- `public/` - Static assets
- `netlify.toml` - Netlify configuration
- `netlify-build.sh` - Build script for Netlify
- `vercel.json` - Vercel configuration
- `vercel-build.sh` - Build script for Vercel

## License

MIT"# cleandaze" 
