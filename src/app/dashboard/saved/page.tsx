'use client';

import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import useItineraries from '@/hooks/useItineraries'
import ItineraryCard from '@/components/ItineraryCard';
import '@/app/globals.css'
import { useEffect } from 'react'
import useAuthToken from '@/hooks/useAuth'

export default function SavedPage() {
  const router = useRouter()
  const { userId } = useAuth()
  const { authToken } = useAuthToken()
  const { 
    itinerariesData, 
    savedItineraries, 
    likedItineraries, 
    toggleLikeItinerary, 
    toggleSaveItinerary, 
    fetchSavedItineraries
  } = useItineraries({ 
    userId: userId as string,
    authToken
  })

  const savedItinerariesList = itinerariesData.filter((itinerary) => savedItineraries.has(itinerary.id))

  useEffect(() => {
    fetchSavedItineraries()
  }, [fetchSavedItineraries])

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container py-6 px-4">
          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight">Saved Itineraries</h2>
            <p className="text-muted-foreground">View all your saved itineraries in one place</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedItinerariesList.length > 0 ? (
              savedItinerariesList.map((itinerary) => (
                <ItineraryCard 
                  key={itinerary.id} 
                  itinerary={itinerary} 
                  isSaved={savedItineraries.has(itinerary.id)}
                  isLiked={likedItineraries.has(itinerary.id)}
                  onToggleSave={() => toggleSaveItinerary(itinerary.id)}
                  onToggleLike={() => toggleLikeItinerary(itinerary.id)}
                />
              ))
            ) : (
              <div className="col-span-full py-8 text-center">
                <p>You have not saved any itineraries yet.</p>
                <p className="mt-2">Browse the dashboard to find and save itineraries.</p>
                <button 
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
                  onClick={() => router.push('/dashboard')}
                >
                  Go to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 