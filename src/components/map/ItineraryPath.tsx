import { Polyline } from 'react-leaflet';
import { MapSpot } from '@/types';

interface ItineraryLine {
  spots: MapSpot[];
}

const ItineraryPath = ({ spots }: ItineraryLine) => {
  // If less than 2 spots, don't render a path
  if (spots.length < 2) {
    return null;
  }

  const positions = spots.map(spot => [
    spot.latitude,
    spot.longitude
  ] as [number, number]);

  return (
    <Polyline
      positions={positions}
      color="hsl(138 18% 43%)"
      weight={3} 
      opacity={0.7}
      dashArray="6, 8"
    />
  );
};

export default ItineraryPath; 