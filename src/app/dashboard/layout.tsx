'use client'

import { usePathname } from 'next/navigation'
import { MapPin, Menu, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserButton } from '@clerk/nextjs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import Link from 'next/link'
import { Toaster } from '@/components/ui/sonner'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isMapView = pathname === '/dashboard/map'

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-[1000] border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full px-4 sm:px-6 flex h-16 items-center justify-between py-2 md:py-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 md:h-6 md:w-6" />
            <Link href="/dashboard">
              <h1 className="text-lg md:text-xl font-bold hover:text-primary">LocalsGo</h1>
            </Link>
          </div>
          
          <div className="flex justify-center">
            <Link href="/dashboard/createItinerary">
              <Button className="gap-1 text-xs md:text-sm px-2 py-1 md:px-4 md:py-2 md:gap-2 md:min-w-[200px] lg:w-[400px] rounded-full">
                <Plus className="h-3 w-3 md:h-4 md:w-4" />
                <span>New Itinerary</span>
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/userItineraries">Itineraries</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/saved">Saved</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/reviews">Reviews</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <UserButton />
          </div>
        </div>
      </header>
      <main className="flex-1 relative z-0 px-4 sm:px-6">
        {isMapView && (
          <Breadcrumb className="py-2 md:py-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Map</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )}
        {children}
        <Toaster />
      </main>
    </div>
  )
} 