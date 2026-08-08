"use client";

import { FormEvent, useState } from "react";
import { LockKeyhole, UserRound, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      router.replace("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F6F4] px-5">
      <div className="w-full max-w-[420px]">
        <div className="overflow-hidden rounded-[30px] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.12)]">

          <div className="bg-[#073F35] px-7 py-10 text-center text-white">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-3xl font-black text-[#073F35]">
              F
            </div>

            <h1 className="text-3xl font-bold">
              Flutes
            </h1>

            <p className="mt-1 text-sm text-white/70">
              Restaurant Administration
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 p-7"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Username
              </label>

              <div className="flex h-12 items-center rounded-xl border border-black/10 px-4">
                <UserRound size={18} className="text-gray-400" />

                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="ml-3 w-full outline-none"
                  placeholder="Admin username"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Password
              </label>

              <div className="flex h-12 items-center rounded-xl border border-black/10 px-4">
                <LockKeyhole size={18} className="text-gray-400" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ml-3 w-full outline-none"
                  placeholder="Password"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-13 w-full items-center justify-center rounded-xl bg-[#073F35] font-bold text-white transition hover:bg-[#0B5144] disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}