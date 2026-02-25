import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import type { Pokemon } from '@/models/pokemon.model';
import { ZardBadgeComponent } from '@/shared/components/badge';
import { ZardCardComponent } from '@/shared/components/card';
import { ZardSkeletonComponent } from '@/shared/components/skeleton';
import { TYPE_COLORS } from './type-colors';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [ZardCardComponent, ZardBadgeComponent, ZardSkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (pokemon(); as poke) {
      <z-card
        class="pokemon-card group cursor-pointer overflow-hidden"
        (click)="cardClick.emit(poke)"
      >
        <div class="relative flex flex-col items-center px-4 pt-4 pb-3">
          <span class="absolute top-2 left-3 font-mono text-xs text-muted-foreground opacity-60">
            {{ formattedId() }}
          </span>

          <div class="relative mb-3 flex h-[120px] w-[120px] items-center justify-center">
            <div
              class="absolute inset-0 rounded-full opacity-20 blur-xl transition-all duration-300 group-hover:opacity-40"
              [style.background]="primaryTypeGradient()"
            ></div>
            <img
              [src]="poke.spriteUrl"
              [alt]="poke.name"
              class="relative z-10 h-[110px] w-[110px] object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          </div>

          <h3 class="mb-1.5 text-sm font-semibold capitalize tracking-wide">
            {{ poke.name }}
          </h3>

          <div class="mb-2 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span>{{ formatWeight(poke.weight) }} kg</span>
            <span class="text-border">|</span>
            <span>{{ formatHeight(poke.height) }} m</span>
          </div>

          <div class="flex flex-wrap justify-center gap-1.5">
            @for (type of poke.types; track type.slot) {
              <z-badge
                class="text-[10px] font-medium uppercase tracking-wider"
                [class]="getTypeClasses(type.name)"
              >
                {{ type.name }}
              </z-badge>
            }
          </div>
        </div>
      </z-card>
    } @else {
      <z-card class="pokemon-card overflow-hidden">
        <div class="flex flex-col items-center px-4 pt-4 pb-3">
          <z-skeleton class="mb-3 h-[120px] w-[120px] rounded-full" />
          <z-skeleton class="mb-1.5 h-4 w-20 rounded" />
          <z-skeleton class="mb-2 h-3 w-24 rounded" />
          <div class="flex gap-1.5">
            <z-skeleton class="h-5 w-14 rounded-full" />
            <z-skeleton class="h-5 w-14 rounded-full" />
          </div>
        </div>
      </z-card>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    .pokemon-card {
      transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
                  box-shadow 0.25s ease;
    }

    .pokemon-card:hover {
      transform: translateY(-6px);
      box-shadow:
        0 12px 28px -8px rgba(0, 0, 0, 0.12),
        0 4px 12px -4px rgba(0, 0, 0, 0.06);
    }
  `,
})
export class PokemonCardComponent {
  readonly pokemon = input<Pokemon | null>(null);
  readonly cardClick = output<Pokemon>();

  protected readonly formattedId = computed(() => {
    const poke = this.pokemon();
    return poke ? `#${String(poke.id).padStart(3, '0')}` : '';
  });

  protected readonly primaryTypeGradient = computed(() => {
    const poke = this.pokemon();
    if (!poke?.types.length) return 'transparent';
    const primary = poke.types[0].name;
    return TYPE_COLORS[primary]?.bg ?? '#94a3b8';
  });

  protected formatWeight(weight: number): string {
    return (weight / 10).toFixed(1);
  }

  protected formatHeight(height: number): string {
    return (height / 10).toFixed(1);
  }

  protected getTypeClasses(typeName: string): string {
    return TYPE_COLORS[typeName]?.classes ?? 'bg-slate-500/15 text-slate-700';
  }
}
