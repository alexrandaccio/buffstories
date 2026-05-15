"use client";

import { useEffect, useReducer, useRef, useState } from "react";
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
  });

  const mapRef = useRef<any>(null);
  const [pins, setPins] = useState<Pin[]>([]);
  const [user, setUser] = useState<any>(null);

  const fetchPins = async () => {
    const { data, error } = await supabase.from("pins").select("*");

    if (error) {
      console.error(error);
      return;
    }

    setPins(data ?? []);
  };

  useEffect(() => {
    fetchPins();
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleMapClick = (e: MapLayerMouseEvent) => {
    if (!user) return;

    dispatch({
      type: "OPEN_CREATE",
      payload: {
        lat: e.lngLat.lat,
        lng: e.lngLat.lng,
      },
    });
  };

  const handleSavePin = async () => {
    // CREATE
    if (state.mode === "create") {
      const { data, error } = await supabase
        .from("pins")
        .insert({
          title: state.draftPin.title,
          description: state.draftPin.description,
          latitude: state.draftPin.latitude,
          longitude: state.draftPin.longitude,
        })
        .select()
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setPins((prev) => [...prev, data]);

      dispatch({ type: "CREATE_SUCCESS" });

      return;
    }

    // EDIT
    if (state.mode === "edit") {
      const { data, error } = await supabase
        .from("pins")
        .update({
          title: state.draftPin.title,
          description: state.draftPin.description,
        })
        .eq("id", state.pinId)
        .select()
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setPins((prev) =>
        prev.map((pin) => (pin.id === state.pinId ? data : pin)),
      );

      dispatch({
        type: "OPEN_VIEW",
        payload: data,
      });

      return;
    }
  };

  const handleDeletePin = async () => {
    if (state.mode !== "view") return;

    const confirmed = window.confirm(`Delete "${state.selectedPin.title}"?`);

    if (!confirmed) return;

    const { error } = await supabase
      .from("pins")
      .delete()
      .eq("id", state.selectedPin.id);

    if (error) {
      console.error(error);
      return;
    }

    setPins((prev) => prev.filter((pin) => pin.id !== state.selectedPin.id));

    dispatch({ type: "CLOSE" });
  };

  const openPin = (pin: Pin) => {
    dispatch({
      type: "OPEN_VIEW",
      payload: pin,
    });

    mapRef.current?.flyTo({
      center: [pin.longitude, pin.latitude],
      duration: 1500,
      zoom: Math.max(mapRef.current.getZoom(), 13),
      essential: true,
    });
  };

  const openAdjacentPin = (direction: "next" | "prev") => {
    if (state.mode !== "view") return;

    const currentIndex = pins.findIndex((p) => p.id === state.selectedPin.id);

    if (currentIndex === -1) return;

    let nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

    // wrap around
    if (nextIndex >= pins.length) {
      nextIndex = 0;
    }

    if (nextIndex < 0) {
      nextIndex = pins.length - 1;
    }

    openPin(pins[nextIndex]);
  };

  return (
    <div className="relative w-full h-screen">
      <Map
        ref={mapRef}
        onClick={handleMapClick}
        initialViewState={{
          longitude: -78.83701,
          latitude: 42.89074,
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
              openPin(pin);
            }}
          >
            <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-lg cursor-pointer" />
          </Marker>
        ))}

        {state.mode === "create" && (
          <Marker
            longitude={state.draftPin.longitude}
            latitude={state.draftPin.latitude}
          >
            <div className="w-5 h-5 rounded-full bg-red-500 border-2 border-white shadow-lg" />
          </Marker>
        )}
      </Map>

      <PinSidebar
        state={state}
        dispatch={dispatch}
        onSave={handleSavePin}
        onDelete={handleDeletePin}
        onNext={() => openAdjacentPin("next")}
        onPrev={() => openAdjacentPin("prev")}
        user={user}
      />
    </div>
  );
}
