"use client";

import { useEffect, useReducer, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Map, {
  Marker,
  NavigationControl,
  MapLayerMouseEvent,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import PinSidebar from "../sidebar/PinSidebar";
import { Pin } from "@/types/pin";
import { reducer } from "@/hooks/mapReducer";

export default function MapView() {
  const [state, dispatch] = useReducer(reducer, {
    mode: "none",
    draftPin: null,
    selectedPin: null,
  });

  const [pins, setPins] = useState<Pin[]>([]);

  const fetchPins = async () => {
    const { data, error } = await supabase.from("pins").select("*");

    if (error) {
      console.error(error);
      return;
    }

    setPins(data || []);
  };

  useEffect(() => {
    fetchPins();
  }, []);

  const handleMapClick = (e: MapLayerMouseEvent) => {
    dispatch({
      type: "OPEN_CREATE",
      payload: {
        lat: e.lngLat.lat,
        lng: e.lngLat.lng,
      },
    });
  };

  const handleSavePin = async () => {
    if (!state.draftPin) return;

    const { error } = await supabase.from("pins").insert({
      title: state.draftPin.title,
      description: state.draftPin.description,
      latitude: state.draftPin.latitude,
      longitude: state.draftPin.longitude,
    });

    if (error) {
      console.error(error);
      return;
    }

    await fetchPins();

    dispatch({ type: "SAVE_SUCCESS" });
  };

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
              dispatch({
                type: "OPEN_VIEW",
                payload: pin,
              });
            }}
          >
            <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-lg cursor-pointer" />
          </Marker>
        ))}

        {state.draftPin && (
          <Marker
            longitude={state.draftPin.longitude}
            latitude={state.draftPin.latitude}
          >
            <div className="w-5 h-5 rounded-full bg-red-500 border-2 border-white shadow-lg" />
          </Marker>
        )}
      </Map>

      <PinSidebar state={state} dispatch={dispatch} onSave={handleSavePin} />
    </div>
  );
}
