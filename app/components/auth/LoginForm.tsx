"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Props = {
  onClose: () => void;
};

export default function LoginForm({ onClose }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error);
      return;
    }

    onClose();
  };

  return (
    <div className="space-y-3 border rounded-xl p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-black">Admin Login</h3>

        <button
          onClick={onClose}
          className="text-gray-400 cursor-pointer hover:text-black"
        >
          ✕
        </button>
      </div>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-black"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-black"
      />

      <button
        onClick={handleLogin}
        className="w-full rounded-lg bg-black py-2 text-white cursor-pointer hover:opacity-90"
      >
        Login
      </button>
    </div>
  );
}
