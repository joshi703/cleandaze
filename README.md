# CLEANDAZE - Maid Service Platform

A modern, interactive platform for booking maid services, designed with a clean user interface and responsive design.

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

## Deployment to Netlify

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

6. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete

7. **Verify Deployment**
   - Check that all routes are working
   - Test authentication functionality
   - Test the waitlist and booking features

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open [http://localhost:5000](http://localhost:5000) in your browser

## Project Structure

- `client/` - Frontend React application
- `server/` - Express backend
- `shared/` - Shared types and schemas
- `functions/` - Netlify serverless functions
- `public/` - Static assets

## License

MIT