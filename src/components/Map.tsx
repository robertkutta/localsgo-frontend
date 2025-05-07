import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapProps } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import DistanceCircle from '@/components/map/DistanceCircle';
import ZoomControls from '@/components/map/ZoomControls';
import MapBoundaries from '@/components/map/MapBoundaries';
import LocationMarker from '@/components/map/LocationMarker';
import SpotMarker from '@/components/map/SpotMarker';
import ItineraryControls from '@/components/map/ItineraryControls';
import ItineraryPath from '@/components/map/ItineraryPath';
import { userLocationIcon } from '@/utils/mapIcons';
import { Marker, Popup } from 'react-leaflet';

// Helper component to handle map size issues
const MapInitializer = () => {
  const map = useMapEvents({});
  
  useEffect(() => {
    // Force map to recalculate dimensions after mounting
    map.invalidateSize();
  }, [map]);
  
  return null;
};

const Map = ({
  center,
  zoom = 13,
  userLocation, 
  locations = [], 
  distanceRadius,
  onSelectItinerary,
  onShowItineraryDetails,
  selectedItineraryId = null,
  itinerarySpots = [],
  useCard = false,
  showInfoBanner = false,
  distanceFilter = null,
  height = "100%"
}: MapProps) => {
  const [isMounted, setIsMounted] = useState(false);
  
  // Convert selectedItineraryId to number if needed
  const numericItineraryId = selectedItineraryId !== null && typeof selectedItineraryId === 'string' 
    ? Number(selectedItineraryId) 
    : selectedItineraryId;
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  if (!isMounted) {
    return <div className="h-full w-full flex items-center justify-center">Loading map...</div>;
  }
  
  const mapCenter = userLocation || center;
  
  const renderMap = () => (
    <div className="h-full w-full">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <MapInitializer />
        
        {/* Info banner */}
        {showInfoBanner && (
          <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 1000 }} className="bg-white/80 px-2 py-1 rounded text-sm">
            {userLocation && distanceFilter !== null && <span>Within {distanceFilter}km</span>}
            {userLocation && distanceFilter === null && <span>All locations</span>}
            {selectedItineraryId && <span>{userLocation ? ' • ' : ''}Viewing selected itinerary</span>}
          </div>
        )}
        
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        
        {/* User location */}
        {userLocation && (
          <Marker position={userLocation} icon={userLocationIcon()}>
            <Popup className="user-location-popup" minWidth={120}>You are here</Popup>
          </Marker>
        )}
        
        {/* Distance circle */}
        {userLocation && distanceRadius && (
          <DistanceCircle userLocation={userLocation} distanceRadius={distanceRadius} />
        )}
        
        {/* Map boundaries */}
        <MapBoundaries 
          userLocation={userLocation} 
          mapLocations={locations} 
          itinerarySpots={itinerarySpots} 
          selectedItineraryId={numericItineraryId} 
        />
        
        {/* Regular location markers */}
        {!selectedItineraryId && locations.map((location, index) => (
          <LocationMarker
            key={`loc-${location.id || index}`}
            location={location}
            index={index}
            onSelectItinerary={onSelectItinerary}
            onShowItineraryDetails={onShowItineraryDetails}
          />
        ))}
        
        {/* Itinerary path */}
        {selectedItineraryId && itinerarySpots.length >= 2 && (
          <ItineraryPath spots={itinerarySpots} />
        )}
        
        {/* Itinerary spot markers */}
        {selectedItineraryId && itinerarySpots.map((spot, idx) => (
          <SpotMarker
            key={`spot-${spot.id || idx}`}
            spot={spot}
            index={spot.index ?? idx}
            onShowItineraryDetails={onShowItineraryDetails}
          />
        ))}
        
        {/* Itinerary controls */}
        {selectedItineraryId && onSelectItinerary && (
          <ItineraryControls
            selectedItineraryId={numericItineraryId}
            itinerarySpots={itinerarySpots}
            onSelectItinerary={onSelectItinerary}
          />
        )}

        <ZoomControls />
      </MapContainer>
    </div>
  );

  // Wrap in card if needed
  if (useCard) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="relative w-full rounded-md overflow-hidden" style={{ height: height }}>
            {renderMap()}
          </div>
        </CardContent>
      </Card>
    );
  }

  return renderMap();
};

export default Map; 