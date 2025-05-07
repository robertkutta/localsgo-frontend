// Global state for Google Maps script loaded status
let googleScriptLoaded = false

/**
 * Loads the Google Maps script with Places library
 */
export const loadGoogleMapsScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Skip if already loaded or not in browser
    if (googleScriptLoaded || typeof window === 'undefined' || window.google?.maps?.places) {
      googleScriptLoaded = true
      resolve()
      return
    }
    
    // Check if script tag already exists
    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')
    if (existingScript) {
      googleScriptLoaded = true
      resolve()
      return
    }
    
    // Load the script
    const script = document.createElement('script')
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    
    if (!apiKey) {
      reject(new Error("Google Maps API key is not defined"))
      return
    }
    
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    
    script.onload = () => {
      googleScriptLoaded = true
      resolve()
    }
    
    script.onerror = () => {
      reject(new Error("Failed to load Google Maps script"))
    }
    
    document.head.appendChild(script)
  })
}

/**
 * Waits for Google Maps to be available
 */
export const waitForGoogleMaps = (timeout = 5000): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google?.maps?.places) {
      resolve()
      return
    }
    
    const startTime = Date.now()
    const interval = setInterval(() => {
      if (window.google?.maps?.places) {
        clearInterval(interval)
        resolve()
      } else if (Date.now() - startTime > timeout) {
        clearInterval(interval)
        reject(new Error("Timeout waiting for Google Maps"))
      }
    }, 100)
  })
} 