"use client"

import type React from "react"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import Link from "next/link"
import { FaLock, FaEnvelope } from "react-icons/fa"

export default function LoginPage() {
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      window.location.href = "/profile"
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 mt-20 border border-blue-100">
        <h1 className="text-3xl font-extrabold text-center text-primary mb-6 flex items-center justify-center gap-2">
          <FaLock className="inline-block text-primary w-7 h-7" /> Login
        </h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400"><FaEnvelope /></span>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
            </div>
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400"><FaLock /></span>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button className="w-full mt-2" disabled={loading} type="submit">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <div className="flex justify-between items-center mt-6">
          <Link href="/forgot-password" className="text-sm text-primary underline">
            Forgot password?
          </Link>
          <p className="text-sm">
            No account?{" "}
            <Link href="/register" className="text-primary underline font-semibold">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
