'use client';
// src/components/dashboard/ThreatMap.tsx
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { useLang } from '@/hooks/useLang';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface ThreatMapProps {
  markers: Array<{ ip: string; country: string; coordinates: [number, number]; count: number }>;
}

export function ThreatMap({ markers }: ThreatMapProps) {
  const { t } = useLang();
  
  return (
    <div className="card p-4">
      <h3 className="font-semibold text-sm mb-4">{t('dash_threat_map')}</h3>
      <div className="bg-black/40 rounded-lg overflow-hidden aspect-video">
        <ComposableMap projectionConfig={{ scale: 140 }}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#27272a"
                  stroke="#3f3f46"
                  strokeWidth={0.5}
                  className="outline-none hover:fill-[#3f3f46] transition-colors"
                />
              ))
            }
          </Geographies>
          {markers.map((marker) => (
            <Marker key={marker.ip} coordinates={marker.coordinates}>
              <circle r={Math.min(marker.count, 15)} fill="#ef4444" opacity={0.6} />
              <circle r={2} fill="#ef4444" />
              <title>{marker.ip} - {marker.country}</title>
            </Marker>
          ))}
        </ComposableMap>
      </div>
    </div>
  );
}