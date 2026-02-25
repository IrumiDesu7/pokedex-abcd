import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, of, tap, map, forkJoin } from 'rxjs';

import type { Pokemon, PokemonAbility, PokemonMove, PokemonType } from '@/models/pokemon.model';

const SPRITE_BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';
const API_BASE = 'https://pokeapi.co/api/v2/pokemon';
const TOTAL_POKEMON = 151;
const PAGE_SIZE = 10;

interface PokeApiResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { slot: number; type: { name: string } }[];
  abilities: { ability: { name: string }; is_hidden: boolean }[];
  moves: { move: { name: string } }[];
}

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private readonly http = inject(HttpClient);
  private readonly cache = new Map<number, Pokemon>();

  readonly totalPages = Math.ceil(TOTAL_POKEMON / PAGE_SIZE);

  getPagePokemon(page: number): Observable<Pokemon[]> {
    const startId = (page - 1) * PAGE_SIZE + 1;
    const endId = Math.min(page * PAGE_SIZE, TOTAL_POKEMON);
    const ids = Array.from({ length: endId - startId + 1 }, (_, i) => startId + i);

    const requests = ids.map((id) => this.getPokemonById(id));
    return forkJoin(requests);
  }

  getPokemonById(id: number): Observable<Pokemon> {
    const cached = this.cache.get(id);
    if (cached) return of(cached);

    return this.http.get<PokeApiResponse>(`${API_BASE}/${id}`).pipe(
      map((data) => this.mapToPokemon(data)),
      tap((pokemon) => this.cache.set(id, pokemon)),
    );
  }

  private mapToPokemon(data: PokeApiResponse): Pokemon {
    const types: PokemonType[] = data.types.map((t) => ({
      slot: t.slot,
      name: t.type.name,
    }));

    const abilities: PokemonAbility[] = data.abilities.map((a) => ({
      name: a.ability.name,
      isHidden: a.is_hidden,
    }));

    const moves: PokemonMove[] = data.moves.map((m) => ({
      name: m.move.name,
    }));

    return {
      id: data.id,
      name: data.name,
      height: data.height,
      weight: data.weight,
      types,
      abilities,
      moves,
      spriteUrl: `${SPRITE_BASE}/${data.id}.png`,
    };
  }
}
