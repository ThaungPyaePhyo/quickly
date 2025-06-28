import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <div className="flex flex-col items-center gap-2">
            <Image
              src="/next.svg"
              alt="Next.js logo"
              width={120}
              height={30}
              className="mb-2"
              priority
            />
            <CardTitle className="text-2xl font-bold text-blue-600">
              Welcome to Quickly
            </CardTitle>
            <p className="text-zinc-500 text-center">
              A modern job platform. Get started by logging in or registering.
            </p>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 mt-2">
          <Button asChild className="w-full">
            <a href="/login">Login</a>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <a href="/register">Register</a>
          </Button>
        </CardContent>
      </Card>
      <footer className="mt-10 text-zinc-400 text-sm">
        &copy; {new Date().getFullYear()} Quickly App. Powered by Next.js, Tailwind, and shadcn/ui.
      </footer>
    </main>
  );
}