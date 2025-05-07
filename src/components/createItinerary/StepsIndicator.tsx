"use client"

import { Check } from "lucide-react"

interface StepsIndicatorProps {
  currentStep: number
  steps: { id: number; name: string }[]
}

export function StepsIndicator({ currentStep, steps }: StepsIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="relative">
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const isActive = currentStep >= step.id
            const isCompleted = currentStep > step.id
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-200 ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-gray-300 bg-white text-gray-500"
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : <span className="text-sm">{step.id}</span>}
                </div>
                <div className={`mt-2 text-sm font-medium transition-colors duration-200 ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {step.name}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 