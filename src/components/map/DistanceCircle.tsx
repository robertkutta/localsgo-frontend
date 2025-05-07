import { Circle } from 'react-leaflet';

interface CircleSetting {
  userLocation: [number, number] | null;
  distanceRadius?: number;
}

const DistanceCircle = ({ userLocation, distanceRadius }: CircleSetting) => {
  if (!userLocation || !distanceRadius) return null;
  
  return (
    <Circle 
      center={userLocation} 
      radius={distanceRadius} 
      pathOptions={{
        color: 'hsl(138 18% 43%)',
        fillColor: 'hsl(138 18% 43%)',
        fillOpacity: 0.1,
        weight: 1
      }}
    />
  );
}

export default DistanceCircle; 