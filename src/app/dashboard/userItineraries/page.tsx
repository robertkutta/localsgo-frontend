'use client';

import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import useItineraries from '@/hooks/useItineraries'
import ItineraryCard from '@/components/ItineraryCard';
import '@/app/globals.css'
import { useEffect, useRef } from 'react'
import useAuthToken from '@/hooks/useAuth'
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function UserItinerariesPage() {
  const router = useRouter()
  const { userId } = useAuth()
  const { authToken } = useAuthToken()
  const fetchedRatingsRef = useRef(false);
  
  const {
    itinerariesData,
    savedItineraries,
    likedItineraries,
    toggleLikeItinerary,
    toggleSaveItinerary,
    fetchUserCreatedItineraries,
    fetchItineraryAverageRating,
    deleteItinerary,
    isLoading
  } = useItineraries({ 
    userId: userId as string,
    authToken
  })

  useEffect(() => {
    fetchUserCreatedItineraries()
    fetchedRatingsRef.current = false;
  }, [fetchUserCreatedItineraries])

  useEffect(() => {
    if (itinerariesData.length > 0 && !isLoading && !fetchedRatingsRef.current) {
      fetchedRatingsRef.current = true;
      itinerariesData.forEach(itinerary => {
        fetchItineraryAverageRating(itinerary.id);
      });
    }
  }, [itinerariesData, isLoading, fetchItineraryAverageRating]);

  return (
    <div className="container py-6 px-4">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">My Itineraries</h2>
        <p className="text-muted-foreground">View and manage the itineraries you&apos;ve created</p>
      </div>

      {isLoading ? (
        <div className="p-8 flex justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {itinerariesData.length > 0 ? (
            itinerariesData.map((itinerary) => (
              <div key={itinerary.id} className="relative">
                <ItineraryCard 
                  itinerary={itinerary} 
                  isSaved={savedItineraries.has(itinerary.id)}
                  isLiked={likedItineraries.has(itinerary.id)}
                  onToggleSave={() => toggleSaveItinerary(itinerary.id)}
                  onToggleLike={() => toggleLikeItinerary(itinerary.id)}
                />
                
                <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center items-center bg-background/95 backdrop-blur-sm pt-4 pb-4 flex-wrap gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1 px-6 hover:bg-secondary transition-colors w-full"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Itinerary
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your itinerary.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => deleteItinerary(itinerary.id)}
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-8 text-center">
              <p>You haven&apos;t created any itineraries yet.</p>
              <p className="mt-2">Create your first itinerary to get started!</p>
              <button 
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
                onClick={() => router.push('/dashboard/createItinerary')}
              >
                Create Itinerary
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 