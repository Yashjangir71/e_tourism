"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signIn } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  userType: z.enum(["tourist", "host"]),
})

type LoginSchema = z.infer<typeof loginSchema>

export default function LoginPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const typeFromQuery = searchParams.get("type")
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => {
    if (typeFromQuery === "tourist" || typeFromQuery === "host") {
      setValue("userType", typeFromQuery)
    }
  }, [typeFromQuery, setValue])

  const onSubmit = async (data: LoginSchema) => {
    const res = await signIn("credentials", {
      redirect: false,
      identifier: data.username,
      password: data.password,
      userType: data.userType,
    })

    if (res?.error) {
      setError("Invalid credentials or unverified account.")
    } else {
      router.push("/app")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fbff] px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold">
            Welcome back to <span className="text-blue-600 font-bold">Le Tour Du World</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">Log in to continue your journey!</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Username</label>
            <Input placeholder="Enter your username" {...register("username")} />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <Input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-[#7c3aed] hover:bg-[#6b21a8] text-white"
          >
            Login
          </Button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <a
            href={`/signup/${typeFromQuery || "tourist"}`}
            className="text-blue-600 hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
