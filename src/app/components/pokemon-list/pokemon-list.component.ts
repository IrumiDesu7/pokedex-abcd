import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import type { Pokemon } from '@/models/pokemon.model';
import { PokemonService } from '@/services/pokemon.service';
import { PokemonCardComponent } from '@/components/pokemon-card/pokemon-card.component';
import { PokemonDetailComponent } from '@/components/pokemon-detail/pokemon-detail.component';
import { ZardPaginationImports } from '@/shared/components/pagination/pagination.imports';
import { ZardDialogService } from '@/shared/components/dialog/dialog.service';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [PokemonCardComponent, ...ZardPaginationImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-5 gap-4">
      @for (pokemon of currentPagePokemon(); track pokemon?.id ?? $index) {
        <app-pokemon-card
          [pokemon]="pokemon"
          (cardClick)="openDetail($event)"
        />
      } @empty {
        @for (_ of skeletonSlots; track $index) {
          <app-pokemon-card [pokemon]="null" />
        }
      }
    </div>

    <div class="mt-8 flex justify-center">
      <z-pagination
        [(zPageIndex)]="currentPage"
        [zTotal]="totalPages"
        [zContent]="paginationTemplate"
        (zPageIndexChange)="onPageChange($event)"
      />

      <ng-template #paginationTemplate>
        <ul z-pagination-content>
          <li z-pagination-item>
            <z-pagination-previous
              [zDisabled]="currentPage() === 1"
              (click)="goToPage(currentPage() - 1)"
            />
          </li>

          @for (page of visiblePages(); track page) {
            <li z-pagination-item>
              <button
                z-pagination-button
                type="button"
                [zActive]="page === currentPage()"
                [zDisabled]="page === currentPage()"
                (click)="goToPage(page)"
              >
                {{ page }}
              </button>
            </li>
          }

          <li z-pagination-item>
            <z-pagination-next
              [zDisabled]="currentPage() === totalPages"
              (click)="goToPage(currentPage() + 1)"
            />
          </li>
        </ul>
      </ng-template>
    </div>
  `,
})
export class PokemonListComponent implements OnInit {
  private readonly pokemonService = inject(PokemonService);
  private readonly dialogService = inject(ZardDialogService);

  readonly currentPage = signal(1);
  readonly currentPagePokemon = signal<(Pokemon | null)[]>([]);
  readonly loading = signal(false);
  readonly totalPages = this.pokemonService.totalPages;
  readonly skeletonSlots = Array.from({ length: 10 });

  readonly visiblePages = computed(() => {
    const page = this.currentPage();
    const total = this.totalPages;

    if (page <= 3) return [1, 2, 3, 4, 5];
    if (page >= total - 2) return [total - 4, total - 3, total - 2, total - 1, total];
    return [page - 2, page - 1, page, page + 1, page + 2];
  });

  ngOnInit(): void {
    this.loadPage(1);
  }

  onPageChange(page: number): void {
    this.loadPage(page);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage()) return;
    this.currentPage.set(page);
    this.loadPage(page);
  }

  openDetail(pokemon: Pokemon): void {
    this.dialogService.create({
      zContent: PokemonDetailComponent,
      zData: pokemon,
      zTitle: undefined,
      zHideFooter: true,
      zWidth: '640px',
      zClosable: true,
    });
  }

  private loadPage(page: number): void {
    const pageSize = 10;
    const startId = (page - 1) * pageSize + 1;
    const endId = Math.min(page * pageSize, 151);
    const count = endId - startId + 1;

    this.currentPagePokemon.set(Array.from({ length: count }, () => null));
    this.loading.set(true);

    this.pokemonService.getPagePokemon(page).subscribe({
      next: (pokemon) => {
        this.currentPagePokemon.set(pokemon);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
