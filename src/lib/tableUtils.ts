import { Character, HealthStatus } from "@/types/character";

export function filterCharacters(
  characters: Character[],
  searchQuery: string,
  healthFilters: Set<HealthStatus>
): Character[] {
  let filtered = characters;

  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (char) =>
        char.name.toLowerCase().includes(query) ||
        char.location.toLowerCase().includes(query)
    );
  }

  // Apply health filter
  if (healthFilters.size > 0) {
    filtered = filtered.filter((char) => healthFilters.has(char.health));
  }

  return filtered;
}

export function sortCharacters(
  characters: Character[],
  sortOrder: "asc" | "desc" | null
): Character[] {
  if (!sortOrder) return characters;

  return [...characters].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.power - b.power;
    }
    return b.power - a.power;
  });
}
