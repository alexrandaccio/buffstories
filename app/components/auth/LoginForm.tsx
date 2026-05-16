"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Props = {
  onClose: () => void;
};

export default function LoginForm({ onClose }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Invalid email or password");
      return;
    }

    onClose();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
      className="space-y-3 border rounded-xl p-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-black">Admin Login</h3>

        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 cursor-pointer hover:text-black"
        >
          ✕
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

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
        type="submit"
        disabled={loading}
        className={`w-full rounded-lg bg-black py-2 text-white transition ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
        }`}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
