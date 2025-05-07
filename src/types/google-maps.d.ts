declare namespace google {
  namespace maps {
    namespace places {
      class Autocomplete {
        constructor(inputField: HTMLInputElement, options?: AutocompleteOptions);
        addListener(eventName: string, handler: () => void): void;
        getPlace(): PlaceResult;
      }

      interface AutocompleteOptions {
        fields?: string[];
        types?: string[];
        componentRestrictions?: { country: string | string[] };
        bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
      }

      interface PlaceResult {
        name?: string;
        place_id?: string;
        formatted_address?: string;
        geometry?: {
          location: {
            lat(): number;
            lng(): number;
          };
        };
      }
    }

    class LatLngBounds {
      constructor(sw?: LatLng, ne?: LatLng);
      extend(point: LatLng): LatLngBounds;
      getCenter(): LatLng;
      getNorthEast(): LatLng;
      getSouthWest(): LatLng;
      isEmpty(): boolean;
      toJSON(): LatLngBoundsLiteral;
      toString(): string;
      toUrlValue(precision?: number): string;
      union(other: LatLngBounds | LatLngBoundsLiteral): LatLngBounds;
    }

    interface LatLngBoundsLiteral {
      east: number;
      north: number;
      south: number;
      west: number;
    }

    class LatLng {
      constructor(lat: number, lng: number, noWrap?: boolean);
      equals(other: LatLng): boolean;
      lat(): number;
      lng(): number;
      toJSON(): LatLngLiteral;
      toString(): string;
      toUrlValue(precision?: number): string;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    namespace event {
      function clearInstanceListeners(instance: object): void;
    }
  }
} 