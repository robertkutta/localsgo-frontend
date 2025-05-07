"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Check, MapPin } from "lucide-react"
import { type ItineraryFormData } from "@/hooks/useItineraryForm"
import { categories, tripTypes } from "./BasicInfoStep"

interface ReviewStepProps {
  formData: ItineraryFormData
  prevStep: () => void
  onSubmit: (e: React.FormEvent) => Promise<void>
  isSubmitting?: boolean
}

export function ReviewStep({ formData, prevStep, onSubmit, isSubmitting = false }: ReviewStepProps) {
  const getCategoryLabel = (id: string) => {
    const category = categories.find((cat) => cat.id === id)
    return category?.label || id
  }

  const getTripTypeLabel = (id: string) => {
    const type = tripTypes.find((t) => t.id === id)
    return type?.label || id
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Your Itinerary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Basic Information</h3>
          <div className="rounded-md border p-4 space-y-3">
            <div><span className="font-medium">Title:</span> {formData.name}</div>
            <div>
              <span className="font-medium">Description:</span>{" "}
              {formData.description || "No description provided"}
            </div>
            <div>
              <span className="font-medium">Trip Types:</span>{" "}
              {formData.tripTypes.length > 0
                ? formData.tripTypes.map((id) => getTripTypeLabel(id)).join(", ")
                : "None selected"}
            </div>
            <div>
              <span className="font-medium">Categories:</span>{" "}
              {formData.spots.length > 0
                ? formData.spots.map((spot) => getCategoryLabel(spot.category)).join(", ")
                : "None selected"}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Spots</h3>
          <div className="rounded-md border p-4 space-y-4">
            {formData.spots.map((spot, index) => (
              <div key={spot.id} className="space-y-2">
                {index > 0 && <Separator />}
                <div className="pt-2">
                  <h4 className="font-medium">
                    {index + 1}. {spot.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {getCategoryLabel(spot.category)} {spot.price && `• ${spot.price}`}
                  </p>
                  {spot.address && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" /> {spot.address}
                    </p>
                  )}
                  {spot.description && <p className="text-sm mt-1">{spot.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep} className="gap-2" disabled={isSubmitting}>
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        <Button onClick={onSubmit} className="gap-2" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"} <Check className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
} 