import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterModule } from '@angular/router';
import { tap } from 'rxjs';
import { FavoriteEntity } from '../../favorites/interfaces/favorite-interface';
import { FavoriteService } from '../../favorites/services/favorite-service';
import { DEFAULT_CENTER } from '../../maps/utils/constants';
import { CardDescriptor } from '../../shared/interfaces/card-descriptor.interface';
import {
  ChipFilter,
  CommonEntityPageComponent,
} from '../../shared/pages/common-entity-page/common-entity-page.component';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-favorite-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    RouterModule,
    MatTabsModule,
    MatCardModule,
    CommonEntityPageComponent,
  ],
  templateUrl: './favorite-page.component.html',
  styleUrls: ['./favorite-page.component.css'],
})
export class FavoritePageComponent implements OnInit {
  private _favoriteService = inject(FavoriteService);
  private _router = inject(Router);
  private _notificationService = inject(NotificationService);

  canQuery = signal<boolean>(true);
  pageIndex = signal(0);
  favorites = signal<FavoriteEntity[]>([]);
  totalElements = signal(0);

  favoriteQueryType = signal<'properties' | 'buildings'>('buildings');
  chipFilters: ChipFilter[] = [
    { id: 'buildings', label: 'Inmuebles' },
    { id: 'properties', label: 'Viviendas' },
  ];
  currentFilter = computed(() =>
    this.chipFilters.find((f) => f.id === this.favoriteQueryType()),
  );

  descriptor: CardDescriptor<FavoriteEntity> = {
    user: (p) => p.ownerName,
    name: (p) => p.title,
    date: (p) => p.favoriteDate,
    id: (p) => p.favoriteId,
    status: (p) => p.type,
    coordinates: (p) =>
      p.latitude != null && p.longitude != null
        ? { latitude: p.latitude, longitude: p.longitude }
        : DEFAULT_CENTER,
  };

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites() {
    if (!this.canQuery()) return;
    if (this.favoriteQueryType() === 'properties') {
      this.loadProperties();
    } else {
      this.loadBuildings();
    }
  }

  loadBuildings() {
    this._favoriteService
      .getFavoriteBuildings(this.pageIndex())
      .pipe(
        tap((newFavorites) => {
          this.favorites.set([...this.favorites(), ...newFavorites.content]);
          this.totalElements.set(newFavorites.totalElements);
          if (newFavorites.totalElements === this.favorites().length)
            this.canQuery.set(false);
        }),
      )
      .subscribe();
  }

  loadProperties() {
    this._favoriteService
      .getFavoriteProperties(this.pageIndex())
      .pipe(
        tap((newFavorites) => {
          this.favorites.set([...this.favorites(), ...newFavorites.content]);
          this.totalElements.set(newFavorites.totalElements);
          if (newFavorites.totalElements === this.favorites().length)
            this.canQuery.set(false);
        }),
      )
      .subscribe();
  }

  loadMore = () => {
    this.pageIndex.update((i) => i + 1);
    this.loadFavorites();
  };

  primaryAction = (favoriteId: string | number | undefined) => {
    const favorite = this.getFavorite(favoriteId);
    if (!favorite) return;
    if (favorite.type === 'building') {
      this._router.navigate(['/buildings', favorite.entityId]);
    } else {
      this._router.navigate(['/properties', favorite.entityId]);
    }
  };

  secondaryAction = (favoriteId: string | number | undefined) => {
    const favorite = this.getFavorite(favoriteId);
    if (!favorite) return;
    this.delete(favorite);
  };

  delete(favorite: FavoriteEntity) {
    this._favoriteService.removeFavorite(favorite.favoriteId).subscribe({
      next: () => {
        this._notificationService.success('Favorito eliminado correctamente');
        this.resetPage();
        this.loadFavorites();
      },
      error: () => {
        this._notificationService.error(
          'Ocurrió un error al eliminar el favorito. Contacte a un administrador',
        );
      },
    });
  }

  changeFavoriteType(type: ChipFilter) {
    this.favoriteQueryType.set(type.id as 'properties' | 'buildings');
    this.resetPage();
    this.loadFavorites();
  }

  private getFavorite(favoriteId: string | number | undefined) {
    return this.favorites().find((fav) => fav.favoriteId === favoriteId);
  }

  private resetPage() {
    this.favorites.set([]);
    this.totalElements.set(0);
    this.pageIndex.set(0);
    this.canQuery.set(true);
  }
}
