import { useEffect, useState } from "react";
import { CharacterTable } from "@/components/CharacterTable";
import { Character } from "@/types/character";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [data, setData] = useState<Character[] | null>(null);

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/characters`);
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Failed to load characters. Please try again later.", error);
        setData([]);
      }
    };

    loadCharacters();
  }, []);

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Loading character data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <main className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Character Management System
          </h1>
          <p className="text-muted-foreground">
            Manage and view character data with advanced filtering, sorting, and search capabilities
          </p>
        </header>
        <CharacterTable data={data} />
      </main>
    </div>
  );
};

export default Index;
