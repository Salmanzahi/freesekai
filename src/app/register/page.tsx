"use client"
import { useEffect, useState } from "react"
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
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerUserWithEmailAndPassword, registerWithGoogle } from "@/app/register/register"
import Link from "next/link"
import { auth } from "@/lib/firebase"
import { isAuth } from "@/lib/isauth"

//  export async function checkAuthUser() {
//   return new Promise((resolve, reject) => {
//     onAuthStateChanged(auth, (user) => {
//       if (user) {
//         resolve(user);
//       } else {
//         reject(new Error("User not authenticated"));
//       }
//     });
//   });
// }
async function registerUser(e: React.FormEvent<HTMLFormElement>, setError: (msg: string) => void) {
  e.preventDefault();

  const form = e.currentTarget;
  const email = form.elements.namedItem("email") as HTMLInputElement;
  const username = form.elements.namedItem("username") as HTMLInputElement;
  const password = form.elements.namedItem("password") as HTMLInputElement;
  const confirmPassword = form.elements.namedItem("confirm-password") as HTMLInputElement;

  if (password.value !== confirmPassword.value) {
    setError("Passwords do not match");
    return;
  }

  try {
    await registerUserWithEmailAndPassword(email.value, password.value, username.value);
    // registration function will redirect to /login on success
  } catch (error) {
    console.error(error);
    setError("Error registering user");
  }
}

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuth();
      setIsAuthUser(authenticated);
    };
    checkAuth();
  }, []);
  const [isAuthUser, setIsAuthUser] = useState(false);

  // const [error, setError] = useState()

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            {isAuthUser
              ? `You are already authenticated${auth.currentUser ? ` as ${auth.currentUser.email}` : ""}`
              : "nope u not authenticated !"}
          </CardTitle>
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

          <form onSubmit={async (e) => {
            setIsLoading(true);
            await registerUser(e, setError);
            setIsLoading(false);
          }}>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Your username"
                  required
                />
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
              <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing up...</>
                ) : (
                  "Sign Up"
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                disabled={isLoading || isGoogleLoading}
                onClick={async () => {
                setIsGoogleLoading(true);
                try {
                  await registerWithGoogle();
                } catch {
                   setError("Google Sign-In failed");
                } finally {
                   setIsGoogleLoading(false);
                }
              }}>
                {isGoogleLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing up with Google...</>
                ) : (
                  "Sign Up with Google"
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
