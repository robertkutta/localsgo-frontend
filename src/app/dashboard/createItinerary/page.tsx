"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useItineraryForm } from "@/hooks/useItineraryForm"
import { submitItinerary } from "@/services/itineraryService"
import { BasicInfoStep } from "@/components/createItinerary/BasicInfoStep"
import { SpotsStep } from "@/components/createItinerary/SpotsStep"
import { ReviewStep } from "@/components/createItinerary/ReviewStep"
import { StepsIndicator } from "@/components/createItinerary/StepsIndicator"
import { useAuth } from "@clerk/nextjs"
import useAuthToken from "@/hooks/useAuth"


const FORM_STEPS = [
  { id: 1, name: "Basic Info" },
  { id: 2, name: "Add Spots" },
  { id: 3, name: "Review" },
]

export default function NewItineraryPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { userId } = useAuth()
  const { authToken } = useAuthToken()

  const {
    formData,
    currentStep,
    updateFormData,
    handleTripTypeToggle,
    addSpot,
    removeSpot,
    updateSpot,
    updateSpotLocation,
    nextStep,
    prevStep,
  } = useItineraryForm()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)
    
    try {
      await submitItinerary(formData, userId as string, authToken)
      router.push("/dashboard")
    } catch (error) {
      console.error('Error submitting itinerary:', error)
      setErrorMessage(`Failed to create itinerary: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const stepComponents = {
    1: <BasicInfoStep
         formData={formData}
         updateFormData={updateFormData}
         handleTripTypeToggle={handleTripTypeToggle}
         nextStep={nextStep}
       />,
    2: <SpotsStep
         formData={formData}
         updateSpot={updateSpot}
         updateSpotLocation={updateSpotLocation}
         addSpot={addSpot}
         removeSpot={removeSpot}
         nextStep={nextStep}
         prevStep={prevStep}
       />,
    3: <ReviewStep
         formData={formData}
         prevStep={prevStep}
         onSubmit={handleSubmit}
         isSubmitting={isSubmitting}
       />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container py-6 px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight">Create New Itinerary</h2>
            <p className="text-muted-foreground">Share your perfect day in your neighborhood</p>
          </div>
          
          <StepsIndicator currentStep={currentStep} steps={FORM_STEPS} />
          
          {errorMessage && (
            <div className="mb-6 p-4 border border-destructive rounded-md bg-destructive/10 text-destructive">
              {errorMessage}
            </div>
          )}
          
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            {stepComponents[currentStep as keyof typeof stepComponents]}
          </form>
        </div>
      </main>
    </div>
  )
} 