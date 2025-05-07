import { MapSpot } from '@/types';

// Google Maps directions URL with waypoints
export function mapsUrl(spots: MapSpot[]): string {
  if (!spots || spots.length < 2) return '';

  // Sort by index
  const sortedSpots = [...spots].sort((a, b) => {
    return (a.index ?? 0) - (b.index ?? 0);
  });

  const start = `${sortedSpots[0].latitude},${sortedSpots[0].longitude}`;
  const end = `${sortedSpots[sortedSpots.length - 1].latitude},${sortedSpots[sortedSpots.length - 1].longitude}`;
  
  // 8 waypoints can be added without paying
  const stops = sortedSpots.slice(1, -1).slice(0, 8)
    .map(spot => `${spot.latitude},${spot.longitude}`)
    .join('|');

  let url = `https://www.google.com/maps/dir/?api=1&origin=${start}&destination=${end}&travelmode=walking`;
  
  if (stops) url += `&waypoints=${stops}`;

  return url;
}

// Single spot Google Maps URL
export function singleSpotUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=walking`;
} 