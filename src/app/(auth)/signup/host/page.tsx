"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const vendorSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  description: z.string().optional(),
  companyName: z.string().optional(),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});

type VendorForm = z.infer<typeof vendorSchema>;

export default function VendorSignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VendorForm>({
    resolver: zodResolver(vendorSchema),
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: VendorForm) => {
    try {
      setServerError(null);
      const response = await axios.post("/api/register-vendor", data);
      if (response.data.success) {
        router.push(`/verify-email?username=${data.username}&type=host`);
      }
    } catch (error: any) {
      setServerError(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50">
      <Card className="w-full max-w-md shadow-xl border-none rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center font-serif tracking-wide">
            Become a Host at <span className="text-blue-600">Le Tour Du World</span>
          </CardTitle>
          <p className="text-center text-muted-foreground text-sm">
            Share your experiences with the world
          </p>
        </CardHeader>
        <Separator />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Username</Label>
              <Input placeholder="username" {...register("username")} />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            </div>
            <div>
              <Label>Full Name</Label>
              <Input placeholder="John Doe" {...register("name")} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label>Email</Label>
              <Input placeholder="you@example.com" {...register("email")} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label>Phone</Label>
              <Input placeholder="+1234567890" {...register("phone")} />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" placeholder="••••••••" {...register("password")} />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <Label>Company Name <span className="text-muted-foreground text-xs">(Optional)</span></Label>
              <Input placeholder="Travel Co." {...register("companyName")} />
            </div>
            <div>
              <Label>Website <span className="text-muted-foreground text-xs">(Optional)</span></Label>
              <Input placeholder="https://yourcompany.com" {...register("website")} />
              {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website.message}</p>}
            </div>
            <div>
              <Label>Description</Label>
              <Textarea placeholder="Tell us about your services..." {...register("description")} />
            </div>

            {serverError && <p className="text-red-600 text-sm text-center">{serverError}</p>}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
