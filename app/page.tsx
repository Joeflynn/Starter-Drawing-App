import { ModeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold text-center">Hello world</h1>
      <ModeToggle />
    </main>
  );
}
