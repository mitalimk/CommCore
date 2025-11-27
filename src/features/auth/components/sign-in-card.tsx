

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-separator";
import { SignInFlow } from "../types";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";


import { TriangleAlert } from "lucide-react";

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignInCard = ({ setState }: SignInCardProps) => {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const onProviderSignIn = async (value: "github" | "google") => {
    try {
      setPending(true);
      await signIn(value);
    } finally {
      setPending(false);
    }
  };

  const onPasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    signIn("password", { email, password, flow: "signIn" })
      .catch(() => {
        setError("Invalid email or password");
      })
      .finally(() => {
        setPending(false);
      });
  };

  return (
    <Card className="w-full h-full p-8 bg-white/10 backdrop-blur-xl border border-white/10 text-gray-100 shadow-2xl rounded-2xl transition-all duration-300 hover:shadow-purple-500/10">
      <CardHeader className="px-0 pt-0 text-center">
        <CardTitle className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text">
          Login to Continue
        </CardTitle>
        <CardDescription className="text-gray-400">
          Use your email or a provider to sign in
        </CardDescription>
      </CardHeader>

      {!!error && (
        <div className="bg-red-500/15 border border-red-500/20 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-400 mb-6">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}

      <CardContent className="space-y-6 px-0 pb-0">
        <form onSubmit={onPasswordSignIn} className="space-y-3">
          <Input
            disabled={pending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
            className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus-visible:ring-purple-500"
          />

          <Input
            disabled={pending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
            className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus-visible:ring-purple-500"
          />

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white font-medium hover:opacity-90 transition-all"
            size="lg"
            disabled={pending}
          >
            {pending ? "Signing in..." : "Continue"}
          </Button>
        </form>

        <div className="flex items-center justify-center">
          <div className="h-px w-full bg-white/10" />
          <span className="text-xs text-gray-500 px-3">OR</span>
          <div className="h-px w-full bg-white/10" />
        </div>

        <div className="flex flex-col gap-y-2.5">
          <Button
            disabled={pending}
            onClick={() => onProviderSignIn("google")}
            variant="outline"
            size="lg"
            className="w-full relative bg-white/10 hover:bg-white/20 border border-white/20 text-gray-200"
          >
            <FcGoogle className="size-5 absolute top-2.5 left-3" />
            Continue with Google
          </Button>

          <Button
            disabled={pending}
            onClick={() => onProviderSignIn("github")}
            variant="outline"
            size="lg"
            className="w-full relative bg-white/10 hover:bg-white/20 border border-white/20 text-gray-200"
          >
            <FaGithub className="size-5 absolute top-2.5 left-3" />
            Continue with GitHub
          </Button>
        </div>

        <p className="text-xs text-gray-400 text-center">
          Don’t have an account?{" "}
          <span
            onClick={() => setState("signUp")}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
