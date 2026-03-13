"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { auth } from "@/lib/firebase"


import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react"


import { loginWithEmailAndPassword, loginWithGoogle } from "./login";

async function handlelogin(e: React.FormEvent) {
  e.preventDefault();
  const email = (e.target as HTMLFormElement).elements.namedItem('email') as HTMLInputElement;
  const password = (e.target as HTMLFormElement).elements.namedItem('password') as HTMLInputElement;
  try {
    const user = await loginWithEmailAndPassword(email.value, password.value);
    // login function handles redirect
    return user;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
}


async function handlesigout() {
  try {
    await auth.signOut();
    console.log("User signed out successfully");
    // Redirect to login page or any other appropriate action
    window.location.href = "/login";
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await handlelogin(e);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to login");
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen">
  <Card className="w-full max-w-sm">
    <CardHeader>
      <CardTitle>Login to your account</CardTitle>
      <CardDescription>
        Enter your email or username below to login to your account
      </CardDescription>
      <CardAction>
        <Button variant="link"><Link href="/register">Sign Up</Link></Button>
      </CardAction>
    </CardHeader>
    <CardContent>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Email or Username</Label>
            <Input
              id="email"
              type="text"
              placeholder="Email or Username"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <a
                href="#"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
            <Input id="password" type={showPassword ? "text" : "password"} required />
            <Button 
              variant='ghost' 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setShowPassword(!showPassword);
              }}
            >
              {showPassword ? (
                <>
                  <EyeOff /> <span>Hide</span>
                </>
              ) : (
                <>
                  <Eye /> <span>Show</span>
                </>
              )}
            </Button>
          </div>
        </div>
        <Button type="submit" className="w-full mt-4 mb-2" disabled={isLoading || isGoogleLoading}>
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...</>
          ) : (
            "Login"
          )}
        </Button>
        <Button 
           variant="outline" 
           type="button"
           className="w-full"
           disabled={isLoading || isGoogleLoading}
           onClick={async () => {
             setIsGoogleLoading(true);
             try {
                await loginWithGoogle();
             } catch {
                // handle error
             } finally {
                setIsGoogleLoading(false);
             }
           }}
           >
        {isGoogleLoading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...</>
        ) : (
          "Login with Google"
        )}
      </Button>
      </form>
    </CardContent>
    <CardFooter className="flex-col gap-2 ">
   
      <Button variant='destructive' onClick={handlesigout}>
        Sign Out
      </Button>
    </CardFooter>
  </Card>
</div>

//test

   
  )
}
