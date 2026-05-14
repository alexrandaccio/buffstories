"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

import Map, {
  Marker,
  NavigationControl,
  MapLayerMouseEvent,
} from "react-map-gl/maplibre";

import "maplibre-gl/dist/maplibre-gl.css";
import PinSidebar from "../sidebar/PinSidebar";

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
  const [mode, setMode] = useState<"none" | "create" | "view">("none");

  const [draftPin, setDraftPin] = useState<DraftPin | null>(null);
  const [pins, setPins] = useState<Pin[]>([]);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);

  const handleMapClick = (e: MapLayerMouseEvent) => {
    setMode("create");

    setSelectedPin(null);

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
    setMode("none");
    setDraftPin(null);
    setSelectedPin(null);
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
              setMode("view");
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

      <PinSidebar
        mode={mode}
        draftPin={draftPin}
        selectedPin={selectedPin}
        setMode={setMode}
        setDraftPin={setDraftPin}
        setSelectedPin={setSelectedPin}
        onSave={handleSavePin}
      />
    </div>
  );
}
