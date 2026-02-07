import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LocationMessage = ({ latitude, longitude, address, placeName, message, isSender }) => {
  // Generate Google Maps URL
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  // Generate static map placeholder URL using OpenStreetMap
  const staticMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <div className={`max-w-sm space-y-2 ${isSender ? 'ml-auto' : 'mr-auto'}`}>
      {/* Map Preview */}
      <div className="relative rounded-lg overflow-hidden border bg-muted/30">
        {/* Using iframe for OSM embed - free, no API key needed */}
        <iframe
          width="100%"
          height="200"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src={staticMapUrl}
          title="Location Map"
        />

      </div>

      {/* Location Info */}
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <MapPin className="size-4 mt-0.5 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            {placeName && (
              <p className="text-sm font-medium truncate">{placeName}</p>
            )}
            <p className="text-xs text-muted-foreground line-clamp-2">
              {address || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`}
            </p>
          </div>
        </div>

        {/* Optional Message */}
        {message && (
          <p className="text-sm">{message}</p>
        )}

        {/* View on Google Maps Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2"
          onClick={() => window.open(googleMapsUrl, '_blank', 'noopener,noreferrer')}
        >
          <ExternalLink className="size-4" />
          View on Google Maps
        </Button>
      </div>
    </div>
  );
};

export default LocationMessage;
