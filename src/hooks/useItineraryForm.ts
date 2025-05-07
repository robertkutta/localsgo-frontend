import { useState } from "react"
import { Spot, ItineraryFormData } from "../types"

const defaultFormData: ItineraryFormData = {
  name: "",
  description: "",
  tripTypes: [],
  spots: [{
    id: 1,
    name: "",
    description: "",
    category: "",
    price: "",
    latitude: 0,
    longitude: 0,
    placeId: "",
    address: "",
    itineraryId: 0 
  }]
}

export function useItineraryForm() {
  const [formData, setFormData] = useState<ItineraryFormData>(defaultFormData)
  const [currentStep, setCurrentStep] = useState(1)

  const updateFormData = <K extends keyof ItineraryFormData>(field: K, value: ItineraryFormData[K]) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleCategoryToggle = (categoryId: string) => {
    const newSpots = formData.spots.map(spot => ({
      ...spot,
      category: spot.category === categoryId ? "" : categoryId
    }));
    updateFormData("spots", newSpots);
  }

  const handleTripTypeToggle = (typeId: string) => {
    const tripTypes = formData.tripTypes.includes(typeId)
      ? formData.tripTypes.filter((id) => id !== typeId)
      : [...formData.tripTypes, typeId]

    updateFormData("tripTypes", tripTypes)
  }

  const addSpot = () => {
    const newId = formData.spots.length + 1 
    const newSpots = [...formData.spots, {
      id: newId,
      name: "",
      description: "",
      category: "",
      price: "",
      latitude: 0,
      longitude: 0,
      placeId: "",
      address: "",
      itineraryId: 0
    }]
    updateFormData("spots", newSpots)
  }

  const removeSpot = (id: number) => {
    if (formData.spots.length > 1) {
      const newSpots = formData.spots.filter((spot) => spot.id !== id)
      updateFormData("spots", newSpots)
    }
  }

  const updateSpot = (id: number, field: keyof Spot, value: string) => {
    const newSpots = formData.spots.map((spot) => 
      (spot.id === id ? { ...spot, [field]: value } : spot)
    )
    updateFormData("spots", newSpots)
  }

  const updateSpotLocation = (id: number, placeData: { 
    name: string, 
    address: string, 
    placeId: string, 
    latitude: number, 
    longitude: number 
  }) => {
    const newSpots = formData.spots.map((spot) => {
      if (spot.id === id) {
        return { 
          ...spot, 
          name: placeData.name,
          address: placeData.address,
          placeId: placeData.placeId,
          latitude: placeData.latitude,
          longitude: placeData.longitude
        }
      }
      return spot
    })
    updateFormData("spots", newSpots)
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return {
    formData,
    currentStep,
    updateFormData,
    handleCategoryToggle,
    handleTripTypeToggle,
    addSpot,
    removeSpot,
    updateSpot,
    updateSpotLocation,
    nextStep,
    prevStep,
  }
}

export type { ItineraryFormData }