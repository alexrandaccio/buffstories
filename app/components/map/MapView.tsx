"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

import Map, {
  Marker,
  NavigationControl,
  MapLayerMouseEvent,
} from "react-map-gl/maplibre";

import "maplibre-gl/dist/maplibre-gl.css";

type DraftPin = {
  latitude: number;
  longitude: number;
  title: string;
  description: string;
};

type Pin = {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string | null;
};

export default function MapView() {
  const [draftPin, setDraftPin] = useState<DraftPin | null>(null);
  const [pins, setPins] = useState<Pin[]>([]);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);

  const handleMapClick = (e: MapLayerMouseEvent) => {
    setDraftPin({
      latitude: e.lngLat.lat,
      longitude: e.lngLat.lng,
      title: "",
      description: "",
    });
  };

  const fetchPins = async () => {
    const { data, error } = await supabase.from("pins").select("*");

    if (error) {
      console.error(error);
      return;
    }

    setPins(data || []);
  };

  const handleSavePin = async () => {
    if (!draftPin) return;

    const { error } = await supabase.from("pins").insert({
      title: draftPin.title,
      description: draftPin.description,
      latitude: draftPin.latitude,
      longitude: draftPin.longitude,
    });

    if (error) {
      console.error(error);
      return;
    }

    await fetchPins();
    setDraftPin(null);
  };

  useEffect(() => {
    fetchPins();
  }, []);

  return (
    <div className="relative w-full h-screen">
      <Map
        onClick={handleMapClick}
        initialViewState={{
          longitude: -74.0431,
          latitude: 40.744,
          zoom: 11,
        }}
        mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
      >
        <NavigationControl position="top-right" />

        {pins.map((pin) => (
          <Marker
            key={pin.id}
            longitude={pin.longitude}
            latitude={pin.latitude}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelectedPin(pin);
              setDraftPin(null);
            }}
          >
            <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-lg cursor-pointer" />
          </Marker>
        ))}

        {draftPin && (
          <Marker longitude={draftPin.longitude} latitude={draftPin.latitude}>
            <div className="w-5 h-5 rounded-full bg-red-500 border-2 border-white shadow-lg" />
          </Marker>
        )}
      </Map>

      {/* Sidebar */}
      {(draftPin || selectedPin) && (
        <div className="absolute top-0 right-0 h-full w-[400px] bg-white shadow-2xl border-l z-10 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-black">
              {draftPin ? "Create Pin" : "View Pin"}
            </h2>

            <button
              onClick={() => {
                setDraftPin(null);
                setSelectedPin(null);
              }}
              className="text-sm text-gray-500 hover:text-black"
            >
              Close
            </button>
          </div>

          {draftPin && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-black">
                  Title
                </label>

                <input
                  value={draftPin.title}
                  onChange={(e) =>
                    setDraftPin({
                      ...draftPin,
                      title: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-black outline-none"
                  placeholder="Enter title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-black">
                  Description
                </label>

                <textarea
                  value={draftPin.description}
                  onChange={(e) =>
                    setDraftPin({
                      ...draftPin,
                      description: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 min-h-[150px] text-black outline-none"
                  placeholder="Enter description"
                />
              </div>

              <div className="text-sm text-gray-500 pt-2">
                <div>Lat: {draftPin.latitude.toFixed(5)}</div>
                <div>Lng: {draftPin.longitude.toFixed(5)}</div>
              </div>

              <button
                onClick={handleSavePin}
                className="w-full bg-black text-white rounded-lg py-3 hover:opacity-90"
              >
                Save Pin
              </button>
            </div>
          )}

          {selectedPin && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-black">
                  {selectedPin.title}
                </h3>
              </div>

              <div className="text-black whitespace-pre-wrap">
                {selectedPin.description || (
                  <span className="text-gray-400">No description</span>
                )}
              </div>

              <div className="text-sm text-gray-500 pt-2">
                <div>Lat: {selectedPin.latitude.toFixed(5)}</div>
                <div>Lng: {selectedPin.longitude.toFixed(5)}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
