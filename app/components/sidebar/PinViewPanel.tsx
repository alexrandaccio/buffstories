"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import LoginForm from "../auth/LoginForm";
import { Pin } from "@/types/pin";

type Props = {
  pin: Pin;
  openEdit: () => void;
  onDelete: () => void;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  user: any;
};

export default function PinViewPanel({
  pin,
  openEdit,
  onDelete,
  onNext,
  onPrev,
  onClose,
  user,
}: Props) {
  const [showLogin, setShowLogin] = useState(false);

  const handleLogout = async () => {
    const confirmed = window.confirm("Log out of admin session?");

    if (!confirmed) return;

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-black">View Pin</h2>

        <button
          onClick={onClose}
          className="text-sm text-gray-500 cursor-pointer hover:text-black"
        >
          Close
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-black">{pin.title}</h3>
        </div>

        <div className="text-black whitespace-pre-wrap leading-relaxed">
          {pin.description || (
            <span className="text-gray-400">No description</span>
          )}
        </div>

        <div className="text-sm text-gray-500 space-y-1">
          <div>Lat: {pin.latitude.toFixed(5)}</div>
          <div>Lng: {pin.longitude.toFixed(5)}</div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onPrev}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-black cursor-pointer hover:bg-gray-100 transition"
          >
            ← Previous
          </button>

          <button
            onClick={onNext}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-black cursor-pointer hover:bg-gray-100 transition"
          >
            Next →
          </button>
        </div>
      </div>

      {/* PUSHER */}
      <div className="flex-1" />

      {/* AUTH FOOTER */}
      <div className="pt-6 border-t">
        {user ? (
          <div className="space-y-3">
            <div className="flex gap-3">
              <button
                onClick={openEdit}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 transition"
              >
                Edit
              </button>

              <button
                onClick={onDelete}
                className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </div>
        ) : showLogin ? (
          <LoginForm onClose={() => setShowLogin(false)} />
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-black cursor-pointer hover:bg-gray-100 transition"
          >
            Admin Login
          </button>
        )}
      </div>
    </div>
  );
}
