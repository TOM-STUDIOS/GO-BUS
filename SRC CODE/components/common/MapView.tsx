import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

interface MapViewProps {
  lat: number;
  lng: number;
  zoom?: number;
  markers?: Array<{ lat: number; lng: number; title?: string }>;
  className?: string;
}

export function MapView({ lat, lng, zoom = 12, markers = [], className = "" }: MapViewProps) {
  // Use a demo API key - user should replace with their own
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAPS_API_KEY_HERE";

  return (
    <div className={className}>
      <APIProvider apiKey={API_KEY}>
        <Map
          defaultCenter={{ lat, lng }}
          defaultZoom={zoom}
          disableDefaultUI={false}
          className="w-full h-full rounded-lg"
        >
          {markers.length > 0 ? (
            markers.map((marker, index) => (
              <Marker
                key={index}
                position={{ lat: marker.lat, lng: marker.lng }}
                title={marker.title}
              />
            ))
          ) : (
            <Marker position={{ lat, lng }} />
          )}
        </Map>
      </APIProvider>
    </div>
  );
}
