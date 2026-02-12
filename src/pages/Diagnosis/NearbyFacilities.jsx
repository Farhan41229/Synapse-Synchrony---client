import React from 'react';
import {
  Building2,
  Stethoscope,
  User,
  Cross,
  X,
  ExternalLink,
  Phone,
  MapPin,
  Clock,
  Loader2,
  Search,
  AlertCircle,
} from 'lucide-react';

const typeConfig = {
  hospital: {
    icon: Building2,
    label: 'Hospital',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/30',
  },
  clinic: {
    icon: Stethoscope,
    label: 'Clinic',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  doctor: {
    icon: User,
    label: 'Doctor',
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-900/30',
  },
  pharmacy: {
    icon: Cross,
    label: 'Pharmacy',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/30',
  },
  other: {
    icon: MapPin,
    label: 'Facility',
    color: 'text-gray-600 dark:text-gray-400',
    bg: 'bg-gray-100 dark:bg-gray-800',
  },
};

const formatDistance = (meters) => {
  if (meters < 1000) return `${meters}m away`;
  return `${(meters / 1000).toFixed(1)} km away`;
};

const NearbyFacilities = ({ facilities, onClose, isLoading, onExpandSearch }) => {
  // Group facilities by type
  const grouped = facilities.reduce((acc, facility) => {
    const type = facility.type || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(facility);
    return acc;
  }, {});

  // Order: hospitals, clinics, doctors, pharmacies
  const typeOrder = ['hospital', 'clinic', 'doctor', 'pharmacy', 'other'];
  const orderedTypes = typeOrder.filter((t) => grouped[t]?.length > 0);

  return (
    <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#04642a] to-[#15a33d] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-white" />
          <h3 className="text-lg font-bold text-white">
            Nearby Medical Facilities
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="p-6 max-h-[500px] overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#04642a]" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Searching for nearby facilities...
            </p>
          </div>
        ) : facilities.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No facilities found within the search radius.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onExpandSearch}
                className="px-4 py-2 bg-[#04642a] text-white rounded-lg hover:bg-[#15a33d] transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search within 10 km
              </button>
              <a
                href="https://www.google.com/maps/search/hospitals+near+me"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Search on Google Maps
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Found {facilities.length} facilities nearby
            </p>

            {orderedTypes.map((type) => {
              const config = typeConfig[type] || typeConfig.other;
              const TypeIcon = config.icon;
              const typeFacilities = grouped[type];

              return (
                <div key={type}>
                  <div className="flex items-center gap-2 mb-3">
                    <TypeIcon className={`w-4 h-4 ${config.color}`} />
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase">
                      {config.label}s ({typeFacilities.length})
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {typeFacilities.map((facility, i) => (
                      <FacilityCard
                        key={`${type}-${i}`}
                        facility={facility}
                        config={config}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const FacilityCard = ({ facility, config }) => {
  const TypeIcon = config.icon;

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className={`p-1.5 rounded-md ${config.bg}`}>
              <TypeIcon className={`w-3.5 h-3.5 ${config.color}`} />
            </div>
            <h5 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
              {facility.name}
            </h5>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span className="capitalize">{facility.type}</span>
            <span>{formatDistance(facility.distance)}</span>
            {facility.emergency && (
              <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full font-semibold">
                Emergency
              </span>
            )}
          </div>

          {facility.address && (
            <p className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5 mb-1">
              <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
              <span>{facility.address}</span>
            </p>
          )}

          {facility.phone && (
            <a
              href={`tel:${facility.phone}`}
              className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1.5 mb-1 hover:underline"
            >
              <Phone className="w-3 h-3" />
              <span>{facility.phone}</span>
            </a>
          )}

          {facility.openingHours && (
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              <span>{facility.openingHours}</span>
            </p>
          )}
        </div>

        <a
          href={facility.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 px-3 py-2 bg-[#04642a] hover:bg-[#15a33d] text-white text-xs rounded-lg transition-colors flex items-center gap-1.5"
        >
          <ExternalLink className="w-3 h-3" />
          Directions
        </a>
      </div>
    </div>
  );
};

export default NearbyFacilities;
