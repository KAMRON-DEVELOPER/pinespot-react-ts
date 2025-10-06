import * as React from 'react';
import { GoogleMap, useLoadScript, Marker, Circle } from '@react-google-maps/api';
import { MapIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';

const defaultCenter = { lat: 41.2995, lng: 69.2401 };

interface Props {
  onSearch: (lat: number, lng: number, radius: number) => void;
}

const MapSearchDialog = ({ onSearch }: Props) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  });

  const [marker, setMarker] = React.useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = React.useState(2000);

  if (!isLoaded) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700'>
          <MapIcon className='h-5 w-5' />
        </button>
      </DialogTrigger>

      <DialogContent
        className='w-[95vw] max-w-4xl h-[90vh] sm:h-auto flex flex-col'
        onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Select Area on Map</DialogTitle>
          <DialogDescription>Click a point on the map and adjust the radius to filter listings.</DialogDescription>
        </DialogHeader>

        <div className='flex-grow'>
          <GoogleMap
            mapContainerClassName='w-full h-full rounded-md'
            center={marker ?? defaultCenter}
            zoom={marker ? 12 : 6}
            onClick={(e) => {
              if (e.latLng) {
                setMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() });
              }
            }}>
            {marker && (
              <>
                <Marker position={marker} />
                <Circle
                  center={marker}
                  radius={radius}
                  options={{
                    fillColor: '#6366f1',
                    fillOpacity: 0.2,
                    strokeColor: '#6366f1',
                    strokeWeight: 2,
                  }}
                />
              </>
            )}
          </GoogleMap>
        </div>

        <div className='mt-4 flex-shrink-0'>
          <div className='text-sm mb-2'>Radius: {(radius / 1000).toFixed(1)} km</div>
          <Slider
            min={500}
            max={20000}
            step={500}
            value={[radius]}
            onValueChange={(val) => setRadius(val[0])}
          />
        </div>

        <DialogFooter className='mt-4 flex-shrink-0'>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => {
              if (marker) onSearch(marker.lat, marker.lng, radius);
            }}
            disabled={!marker}>
            Search
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MapSearchDialog;
