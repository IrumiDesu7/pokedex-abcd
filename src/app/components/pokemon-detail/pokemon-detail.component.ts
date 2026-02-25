import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import type { Pokemon } from '@/models/pokemon.model';
import { ZardBadgeComponent } from '@/shared/components/badge';
import { Z_MODAL_DATA } from '@/shared/components/dialog/dialog.service';
import { TYPE_COLORS } from '@/components/pokemon-card/type-colors';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [ZardBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-6 sm:flex-row">
      <div class="flex shrink-0 flex-col items-center">
        <div class="relative mb-3">
          <div
            class="absolute inset-0 rounded-full opacity-25 blur-2xl"
            [style.background]="primaryColor"
          ></div>
          <img
            [src]="pokemon.spriteUrl"
            [alt]="pokemon.name"
            class="relative z-10 h-[180px] w-[180px] object-contain drop-shadow-lg"
          />
        </div>

        <span class="font-mono text-xs text-muted-foreground">
          {{ '#' + String(pokemon.id).padStart(3, '0') }}
        </span>
        <h2 class="text-xl font-bold capitalize">{{ pokemon.name }}</h2>

        <div class="mt-1 flex gap-1.5">
          @for (type of pokemon.types; track type.slot) {
            <z-badge
              class="text-[10px] font-medium uppercase tracking-wider"
              [class]="getTypeClasses(type.name)"
            >
              {{ type.name }}
            </z-badge>
          }
        </div>

        <div class="mt-3 flex gap-6 text-sm text-muted-foreground">
          <div class="text-center">
            <div class="font-semibold text-foreground">{{ (pokemon.weight / 10).toFixed(1) }} kg</div>
            <div class="text-xs">Weight</div>
          </div>
          <div class="text-center">
            <div class="font-semibold text-foreground">{{ (pokemon.height / 10).toFixed(1) }} m</div>
            <div class="text-xs">Height</div>
          </div>
        </div>
      </div>

      <div class="flex min-w-0 flex-1 flex-col gap-4">
        <div>
          <h4 class="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Abilities
          </h4>
          <div class="flex flex-wrap gap-1.5">
            @for (ability of pokemon.abilities; track ability.name) {
              <z-badge
                zType="outline"
                class="text-xs capitalize"
                [class]="ability.isHidden ? 'border-dashed opacity-70' : ''"
              >
                {{ formatName(ability.name) }}
                @if (ability.isHidden) {
                  <span class="ml-1 text-[10px] text-muted-foreground">(hidden)</span>
                }
              </z-badge>
            }
          </div>
        </div>

        <div>
          <h4 class="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Moves
            <span class="ml-1 font-normal normal-case">({{ pokemon.moves.length }})</span>
          </h4>
          <div class="max-h-[240px] overflow-y-auto pr-1">
            <div class="flex flex-wrap gap-1">
              @for (move of pokemon.moves; track move.name) {
                <z-badge
                  zType="secondary"
                  class="text-[10px] capitalize"
                >
                  {{ formatName(move.name) }}
                </z-badge>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PokemonDetailComponent {
  protected readonly pokemon = inject<Pokemon>(Z_MODAL_DATA);
  protected readonly String = String;

  protected readonly primaryColor =
    TYPE_COLORS[this.pokemon.types[0]?.name]?.bg ?? '#94a3b8';

  protected getTypeClasses(typeName: string): string {
    return TYPE_COLORS[typeName]?.classes ?? 'bg-slate-500/15 text-slate-700';
  }

  protected formatName(name: string): string {
    return name.replace(/-/g, ' ');
  }
}
