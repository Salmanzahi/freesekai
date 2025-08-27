"use client"
import { useState } from "react"
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
import { Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription, AlertTitle,} from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerUserWithEmailAndPassword } from "@/app/register/register"
// import { Alert } from "@/components/ui/alert"
import Link from "next/link"

async function registerUser(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();

  const form = e.currentTarget; // ✅ safer than e.target
  const email = form.elements.namedItem("email") as HTMLInputElement;
  const password = form.elements.namedItem("password") as HTMLInputElement;
  const confirmPassword = form.elements.namedItem("confirm-password") as HTMLInputElement;

  if (password.value !== confirmPassword.value) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Passwords do not match</AlertTitle>
        <AlertDescription>
          The password and confirm password fields do not match.
        </AlertDescription>
      </Alert>
    )
  }

  try {
    await registerUserWithEmailAndPassword(email.value, password.value);
    alert("User registered successfully");
  } catch (error) {
    alert("Error registering user");
    console.error(error);
  }
}

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  // const [error, setError] = useState()

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Register to your account</CardTitle>
          <CardDescription>
            Enter your email below to register to your account
          </CardDescription>
          <CardAction>
            <Button variant="link">
              <Link href="/login">Sign In</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {/* ✅ attach handler here */}
          <form onSubmit={registerUser}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"        // ✅ add name
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"    
                  type={showPassword ? "text" : "password"}
                  required
                />

                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  name="confirm-password"   
                  type={showPassword ? "text" : "password"}
                  required
                />

                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
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
            {/* ✅ move submit button inside form */}
            <CardFooter className="flex-col gap-2 mt-4">
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
              <Button variant="outline" className="w-full">
                Sign Up with Google
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
