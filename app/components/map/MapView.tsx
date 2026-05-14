"use client";

import { useState } from "react";

import Map, {
  Marker,
  NavigationControl,
  MapLayerMouseEvent
} from "react-map-gl/maplibre";

import "maplibre-gl/dist/maplibre-gl.css";

type DraftPin = {
  latitude: number;
  longitude: number;
  title: string;
  description: string;
};

export default function MapView() {
  const [draftPin, setDraftPin] = useState<DraftPin | null>(null);

  const handleMapClick = (e: MapLayerMouseEvent) => {
    setDraftPin({
      latitude: e.lngLat.lat,
      longitude: e.lngLat.lng,
      title: "",
      description: ""
    });
  };

  return (
    <div className="relative w-full h-screen">
      <Map
        onClick={handleMapClick}
        initialViewState={{
          longitude: -74.0431,
          latitude: 40.744,
          zoom: 11
        }}
        mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
      >
        <NavigationControl position="top-right" />

        {draftPin && (
          <Marker
            longitude={draftPin.longitude}
            latitude={draftPin.latitude}
          >
            <div className="w-5 h-5 rounded-full bg-red-500 border-2 border-white shadow-lg" />
          </Marker>
        )}
      </Map>

      {draftPin && (
        <div className="absolute top-0 right-0 h-full w-[400px] bg-white shadow-2xl border-l z-10 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-black text-xl font-semibold">Create Pin</h2>

            <button
              onClick={() => setDraftPin(null)}
              className="text-sm text-gray-500 hover:text-black"
            >
              Close
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-black font-medium mb-1">
                Title
              </label>

              <input
                type="text"
                value={draftPin.title}
                onChange={(e) =>
                  setDraftPin({
                    ...draftPin,
                    title: e.target.value
                  })
                }
                className="w-full border text-black rounded-lg px-3 py-2 outline-none"
                placeholder="Enter title"
              />
            </div>

            <div>
              <label className="block text-sm text-black font-medium mb-1">
                Description
              </label>

              <textarea
                value={draftPin.description}
                onChange={(e) =>
                  setDraftPin({
                    ...draftPin,
                    description: e.target.value
                  })
                }
                className="w-full border text-black rounded-lg px-3 py-2 min-h-[150px] outline-none"
                placeholder="Enter description"
              />
            </div>

            <div className="text-sm text-gray-500 pt-2">
              <div>
                Lat: {draftPin.latitude.toFixed(5)}
              </div>

              <div>
                Lng: {draftPin.longitude.toFixed(5)}
              </div>
            </div>

            <button
              className="w-full bg-black text-white rounded-lg py-3 hover:opacity-90"
            >
              Save Pin
            </button>
          </div>
        </div>
      )}
    </div>
  );
}