"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight, ChevronLeft, Plus, Trash2 } from "lucide-react"
import { type Spot, type ItineraryFormData } from "@/types"
import { PlaceAutocomplete } from "./PlaceAutocomplete"
import { categories } from "./BasicInfoStep"

interface SpotsStepProps {
  formData: ItineraryFormData
  updateSpot: (id: number, field: keyof Spot, value: string) => void
  updateSpotLocation: (id: number, placeData: { 
    name: string, 
    address: string, 
    placeId: string, 
    latitude: number, 
    longitude: number 
  }) => void
  addSpot: () => void
  removeSpot: (id: number) => void
  nextStep: () => void
  prevStep: () => void
}

export function SpotsStep({
  formData,
  updateSpot,
  updateSpotLocation,
  addSpot,
  removeSpot,
  nextStep,
  prevStep,
}: SpotsStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spots in Your Itinerary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {formData.spots.map((spot, index) => (
          <div key={spot.id} className="space-y-4">
            {index > 0 && <Separator />}
            <div className="pt-4 flex items-center justify-between">
              <h3 className="text-lg font-medium">Spot {index + 1}</h3>
              {formData.spots.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSpot(spot.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove spot</span>
                </Button>
              )}
            </div>

            <PlaceAutocomplete 
              spotId={spot.id} 
              spot={spot} 
              onLocationUpdate={updateSpotLocation} 
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={spot.name}
                  onChange={(e) => updateSpot(spot.id, "name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={spot.category} onValueChange={(value) => updateSpot(spot.id, "category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="What makes this place special? Any tips for visitors?"
                value={spot.description}
                onChange={(e) => updateSpot(spot.id, "description", e.target.value)}
                rows={2}
              />
            </div>

            {["coffee", "restaurant", "nightlife"].includes(spot.category) && (
              <div className="space-y-2">
                <Label>Price Range</Label>
                <Select 
                  value={spot.price || ""} 
                  onValueChange={(value) => updateSpot(spot.id, "price", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select price range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="£">£ (Inexpensive)</SelectItem>
                    <SelectItem value="££">££ (Moderate)</SelectItem>
                    <SelectItem value="£££">£££ (Expensive)</SelectItem>
                    <SelectItem value="££££">££££ (Very Expensive)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        ))}
        <div className="flex justify-center mt-6">
          <Button type="button" variant="outline" onClick={addSpot} className="gap-2">
            <Plus className="h-4 w-4" /> Add Another Spot
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={prevStep} className="gap-2">
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        <Button
          type="button"
          onClick={nextStep}
          disabled={formData.spots.some((spot) => !spot.name || !spot.category)}
          className="gap-2"
        >
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
} 