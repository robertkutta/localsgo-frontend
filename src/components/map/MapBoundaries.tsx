import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapSpot, Spot } from '@/types';

interface MapUpdate {
  userLocation: [number, number] | null;
  mapLocations: Spot[];
  itinerarySpots: MapSpot[];
  selectedItineraryId: number | null;
}

// Helper function to get coordinates from location
const getCoordinates = (location: Spot | MapSpot): [number, number] => {
  const lat = typeof location.latitude === 'string' ? parseFloat(location.latitude) : location.latitude;
  const lng = typeof location.longitude === 'string' ? parseFloat(location.longitude) : location.longitude;
  return [lat, lng];
};

// Extend the Leaflet Map type to include internal properties
interface ExtendedMap extends L.Map {
  _loaded?: boolean;
}

// Helper to check if map is ready
const isMapReady = (map: L.Map): boolean => {
  return map && (map as ExtendedMap)._loaded === true;
};

const MapBoundaries = (props: MapUpdate) => {
  const map = useMap();
  
  const updateBounds = () => {
    if (!map || !isMapReady(map)) {
      return;
    }
    
    try {
      // Handle spots for selected itinerary
      if (props.selectedItineraryId && props.itinerarySpots.length > 0) {
        const coordinates = props.itinerarySpots
          .filter(spot => spot.latitude !== undefined && spot.longitude !== undefined)
          .map(spot => getCoordinates(spot));
        
        if (coordinates.length > 0) {
          const bounds = L.latLngBounds(coordinates);
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
        }
      }
      // Handle all map locations
      else if (props.mapLocations.length > 0) {
        const coordinates = props.mapLocations
          .filter(loc => loc.latitude !== undefined && loc.longitude !== undefined)
          .map(loc => getCoordinates(loc));
        
        if (coordinates.length > 0) {
          const bounds = L.latLngBounds(coordinates);
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
        }
      }
      // If there's only user location, center on it
      else if (props.userLocation) {
        map.setView(props.userLocation, 13);
      }
    } catch (error) {
      console.error('Error updating map bounds:', error);
    }
  };
  
  // Run only when component mounts and when selectedItineraryId changes
  useEffect(() => {
    if (map && isMapReady(map)) {
      updateBounds();
    } else {
      const handleMapReady = () => {
        updateBounds();
        map.off('load', handleMapReady);
      };
      map.on('load', handleMapReady);
    }
  });
  
  return null;
}

export default MapBoundaries; 