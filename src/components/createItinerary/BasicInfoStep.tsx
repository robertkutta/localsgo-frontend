"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import type { ItineraryFormData } from "@/hooks/useItineraryForm"

import {
  Coffee,
  Utensils,
  Music,
  Umbrella,
  Wine,
  Dumbbell,
  ShoppingBag,
  Landmark,
  TreePine,
} from "lucide-react"

interface BasicInfoStepProps {
  formData: ItineraryFormData
  updateFormData: <K extends keyof ItineraryFormData>(field: K, value: ItineraryFormData[K]) => void
  handleTripTypeToggle: (typeId: string) => void
  nextStep: () => void
}

export const categories = [
  { id: "coffee", label: "Coffee", icon: <Coffee className="h-4 w-4" /> },
  { id: "restaurant", label: "Restaurant", icon: <Utensils className="h-4 w-4" /> },
  { id: "entertainment", label: "Entertainment", icon: <Music className="h-4 w-4" /> },
  { id: "leisure", label: "Leisure", icon: <Umbrella className="h-4 w-4" /> },
  { id: "nightlife", label: "Nightlife", icon: <Wine className="h-4 w-4" /> },
  { id: "gym", label: "Gym", icon: <Dumbbell className="h-4 w-4" /> },
  { id: "shopping", label: "Shopping", icon: <ShoppingBag className="h-4 w-4" /> },
  { id: "cultural", label: "Cultural", icon: <Landmark className="h-4 w-4" /> },
  { id: "outdoor", label: "Outdoor", icon: <TreePine className="h-4 w-4" /> },
]

export const tripTypes = [
  { id: "business", label: "Business" },
  { id: "leisure", label: "Leisure" },
  { id: "active", label: "Active" },
  { id: "family", label: "Family" },
  { id: "couples", label: "Couples" },
]

export function BasicInfoStep({
  formData,
  updateFormData,
  handleTripTypeToggle,
  nextStep,
}: BasicInfoStepProps) {
  const router = useRouter()
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Itinerary Title</Label>
          <Input
            id="title"
            placeholder="e.g., Sarah's Day in Soho"
            value={formData.name}
            onChange={(e) => updateFormData("name", e.target.value)}
            required
          />
          <p className="text-sm text-muted-foreground">
            Give your itinerary a title that includes your name and location.
          </p>
        </div>

        <div className="space-y-2 pt-4">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Briefly describe what makes this itinerary special..."
            value={formData.description}
            onChange={(e) => updateFormData("description", e.target.value)}
            rows={3}
          />
        </div>

        <div className="">
          <Label>Trip Type</Label>
          <div className="mt-4 flex flex-wrap gap-4">
            {tripTypes.map((type) => (
              <Badge
                key={type.id}
                variant={formData.tripTypes.includes(type.id) ? "default" : "outline"}
                className="cursor-pointer py-1 px-2 text-xs"
                onClick={() => handleTripTypeToggle(type.id)}
              >
                {type.label}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">Select what type of trip this itinerary is best for.</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
          Cancel
        </Button>
        <Button 
          type="button" 
          onClick={nextStep} 
          disabled={!formData.name || formData.tripTypes.length === 0}
          className="gap-2"
        >
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
} 