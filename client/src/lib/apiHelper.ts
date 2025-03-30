/**
 * Adjusts API URLs to work with Netlify Functions or direct API calls
 * depending on the environment
 */
export function getApiUrl(path: string): string {
  // Remove leading slash if it exists
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // For Netlify environment in production
  if (import.meta.env.PROD) {
    return `/.netlify/functions/api/${cleanPath}`;
  }
  
  // For development environment
  return `/${cleanPath}`;
}