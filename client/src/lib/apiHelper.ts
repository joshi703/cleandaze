/**
 * Adjusts API URLs to work with Netlify/Vercel Functions or direct API calls
 * depending on the environment
 */
export function getApiUrl(path: string): string {
  // Remove leading slash if it exists
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // For production environment
  if (import.meta.env.PROD) {
    // Check for Vercel-specific environment variable
    if (import.meta.env.VITE_VERCEL_DEPLOYMENT === 'true') {
      return `/api/${cleanPath}`;
    }
    // Default to Netlify
    return `/.netlify/functions/api/${cleanPath}`;
  }
  
  // For development environment
  return `/${cleanPath}`;
}