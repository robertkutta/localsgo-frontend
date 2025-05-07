"use client"

import { useRef, useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { loadGoogleMapsScript, waitForGoogleMaps } from "@/utils/googleMaps"
import { type Spot } from "@/types"

interface PlaceAutocompleteProps {
  spotId: number
  spot: Spot
  onLocationUpdate: (
    id: number,
    placeData: {
      name: string
      address: string
      placeId: string
      latitude: number
      longitude: number
    }
  ) => void
}

export function PlaceAutocomplete({
  spotId,
  spot,
  onLocationUpdate,
}: PlaceAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const [status, setStatus] = useState<{ loading: boolean; error: string | null }>({ 
    loading: false, 
    error: null 
  })

  // Initialize Google Maps and autocomplete
  useEffect(() => {
    if (!inputRef.current || autocompleteRef.current) return

    const initializeAutocomplete = async () => {
      setStatus({ loading: true, error: null })
      
      try {
        await loadGoogleMapsScript()
        await waitForGoogleMaps()
        
        // Ensure inputRef.current is not null before creating Autocomplete
        if (!inputRef.current) {
          setStatus({ loading: false, error: "Input element not available" })
          return
        }
        
        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          fields: ['place_id', 'geometry', 'name', 'formatted_address'],
          types: ['establishment']
        })
        
        autocompleteRef.current = autocomplete
        
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          
          if (place?.geometry?.location) {
            onLocationUpdate(spotId, {
              name: place.name || '',
              address: place.formatted_address || '',
              placeId: place.place_id || '',
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng()
            })
          }
        })
      } catch (error) {
        console.error("Error initializing Google Maps autocomplete:", error)
        setStatus({ loading: false, error: "Failed to initialize location search" })
        return
      }
      
      setStatus({ loading: false, error: null })
    }

    initializeAutocomplete()

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current)
        autocompleteRef.current = null
      }
    }
  }, [spotId, onLocationUpdate])

  // Update input value when spot address changes
  useEffect(() => {
    if (inputRef.current && spot?.address) {
      inputRef.current.value = spot.address
    }
  }, [spot?.address])

  return (
    <div className="space-y-2">
      <Label htmlFor={`spot-location-${spotId}`}>Location</Label>
      <div className="mt-2">
        <input
          ref={inputRef}
          id={`spot-location-${spotId}`}
          type="text"
          placeholder={status.loading ? "Loading map services..." : "Search for a place..."}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={status.loading}
        />
      </div>
      {status.error && <p className="text-xs text-destructive">{status.error}</p>}
      {spot?.address && !spot?.placeId && !status.loading && (
        <p className="text-xs text-amber-500">Select a location from the dropdown to confirm</p>
      )}
      {spot?.latitude && spot?.longitude && (
        <p className="text-xs text-green-500">Location confirmed ✓</p>
      )}
    </div>
  )
} 