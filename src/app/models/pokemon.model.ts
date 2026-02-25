export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokemonType[];
  abilities: PokemonAbility[];
  moves: PokemonMove[];
  spriteUrl: string;
}

export interface PokemonType {
  slot: number;
  name: string;
}

export interface PokemonAbility {
  name: string;
  isHidden: boolean;
}

export interface PokemonMove {
  name: string;
}
