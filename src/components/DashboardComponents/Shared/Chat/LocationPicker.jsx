import React, { useState, useEffect } from 'react';
import { MapPin, X, Send, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLocation } from '@/hooks/use-location';
import { useChat } from '@/hooks/use-chat';
import { useAuthStore } from '@/store/authStore';

const LocationPicker = ({ chatId, replyTo, isOpen, onClose }) => {
  const { getLocationWithAddress, isLoading, error, locationData, reset } = useLocation();
  const { sendLocationMessage } = useChat();
  const { user } = useAuthStore();
  
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Fetch location when dialog opens
  useEffect(() => {
    if (isOpen) {
      getLocationWithAddress().catch((err) => {
        console.error('Location error:', err);
      });
    } else {
      // Reset when dialog closes
      reset();
      setMessage('');
    }
  }, [isOpen]);

  const handleShare = async () => {
    if (!locationData) return;

    setIsSending(true);

    try {
      await sendLocationMessage({
        chatId,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        address: locationData.address,
        placeName: locationData.placeName,
        message: message.trim(),
        replyTo,
        user,
      });

      onClose();
    } catch (error) {
      console.error('Error sharing location:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleRetry = () => {
    reset();
    getLocationWithAddress().catch((err) => {
      console.error('Location error:', err);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="size-5 text-primary" />
            Share Location
          </DialogTitle>
          <DialogDescription>
            Share your current location with this chat
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Getting your location...</p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="size-6 text-destructive" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-destructive">Location Error</p>
                <p className="text-xs text-muted-foreground max-w-xs">{error}</p>
              </div>
              <Button onClick={handleRetry} variant="outline" size="sm">
                Try Again
              </Button>
            </div>
          )}

          {/* Success State */}
          {locationData && !isLoading && !error && (
            <div className="space-y-4">
              {/* Location Info */}
              <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="size-4 mt-0.5 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {locationData.placeName || 'Current Location'}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {locationData.address}
                    </p>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground font-mono">
                    {locationData.latitude.toFixed(6)}, {locationData.longitude.toFixed(6)}
                  </p>
                  {locationData.accuracy && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Accuracy: ±{Math.round(locationData.accuracy)}m
                    </p>
                  )}
                </div>
              </div>

              {/* Optional Message */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Add a message (optional)
                </label>
                <Input
                  placeholder="e.g., Meet me here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={200}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleShare}
            disabled={!locationData || isLoading || isSending}
            className="gap-2"
          >
            {isSending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Sharing...
              </>
            ) : (
              <>
                <Send className="size-4" />
                Share Location
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LocationPicker;
