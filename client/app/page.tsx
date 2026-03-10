import { ModeToggle } from "@/components/ModeToggle";

const Page = () => {
  return (
    <div className="min-h-screen p-8 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">I am Home</h1>
      <ModeToggle />
    </div>
  );
};

export default Page;