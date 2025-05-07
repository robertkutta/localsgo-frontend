import L from 'leaflet';

// Create SVGs as encoded data URLs
export const markerIcon = L.icon({
  iconUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" viewBox="0 0 24 32"><path d="M12 0C7.038 0 3 4.066 3 9.065C3 16.168 12 24 12 24s9-7.832 9-14.935C21 4.066 16.962 0 12 0z" fill="hsl(138 18% 43%)" stroke="white" stroke-width="1.5" stroke-linejoin="round"/><circle cx="12" cy="9" r="3" fill="white"/></svg>`,
  iconSize: [24, 32],
  iconAnchor: [12, 32],
  popupAnchor: [0, -32],
});

// Creating a function to get the numbered icons
export function numberIcon(number: number) {
  return L.icon({
    iconUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40"><path d="M16 0C9.038 0 3 6.066 3 13.065C3 23.168 16 40 16 40s13-16.832 13-26.935C29 6.066 22.962 0 16 0z" fill="hsl(138 18% 43%)" stroke="white" stroke-width="1.5" stroke-linejoin="round"/><circle cx="16" cy="13" r="10" fill="white"/><text x="16" y="17" font-family="Arial" font-size="12" font-weight="bold" text-anchor="middle" fill="hsl(138 18% 43%)">${number}</text></svg>`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  });
}

// Creating a function to get the user location marker icon
export function userLocationIcon() {
  return L.divIcon({
    className: 'user-location-marker',
    html: `<div style="position: relative; background-color: hsl(138 18% 43%); width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
} 