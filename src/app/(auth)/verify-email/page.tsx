"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams()
  const username = searchParams.get("username")
  const type = searchParams.get("type")

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await axios.post("/api/verify-email", {
        type,
        username,
        verifyCode: code,
      });

      setMessage(response.data.message);

      setTimeout(() => {
        if (type == "tourist") {
          router.push(`/select-preference?touristUsername=${username}`); 
        }// Redirect to your post-login page
        else{

        router.push(`/login?type=${type}`); 
        }
      }, 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border border-muted">
        <CardContent className="p-6 flex flex-col gap-4">
          <h1 className="text-2xl font-semibold text-center">Verify Your Email</h1>
          <p className="text-center text-muted-foreground text-sm">
            Enter the 6-digit code sent to your email
          </p>
          <Input
            placeholder="Enter verification code"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="text-center tracking-widest text-lg"
          />
          <Button
            onClick={handleVerify}
            disabled={loading || code.length !== 6}
            className="mt-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Verify
          </Button>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          {message && <p className="text-sm text-green-600 text-center">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}