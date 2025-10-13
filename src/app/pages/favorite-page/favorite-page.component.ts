import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FavoriteService } from '../../favorites/services/favorite-service';
import { FavoriteResponse } from '../../favorites/interfaces/favorite-interface';
import { MatTableDataSource } from '@angular/material/table';
import { BuildingsService } from '../../buildings/buildings.service';
import { PropertiesService } from '../../properties/properties.service';

@Component({
  selector: 'app-favorite-page',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule, RouterModule, MatTabsModule, MatCardModule],
  templateUrl: './favorite-page.component.html',
  styleUrls: ['./favorite-page.component.css']
})
export class FavoritePageComponent implements OnInit {
  // For Angular Material tabs
  selectedTab = 0;

  allFavorites: any[] = [];
  buildingFavorites: any[] = [];
  propertyFavorites: any[] = [];

  constructor(
    private favoriteService: FavoriteService,
    private router: Router,
    private buildingsService: BuildingsService,
    private propertiesService: PropertiesService
  ) {}

  ngOnInit(): void {
    let userId = localStorage.getItem('userId');
    if (userId) {
      userId = userId.toUpperCase();
      // Fetch building favorites and map to card data
      this.favoriteService.getFavoritesByUserAndBuilding(userId).subscribe(favs => {
        const validFavs = favs.filter(fav => !!fav.buildingID);
        Promise.all(
          validFavs.map(fav =>
            this.buildingsService.getBuildingDetails(fav.buildingID!).toPromise()
              .then(details => ({
                ...fav,
                type: 'Edificio',
                name: details?.name || fav.buildingID,
                description: details?.description || '',
                address: details?.address || '',
                owner: details?.userFullName || '',
                image: details?.imagesURL && details.imagesURL.length > 0 ? details.imagesURL[0] : null
              }))
          )
        ).then(cards => {
          this.buildingFavorites = cards;
          this.updateAllFavorites();
        });
      });
      // Fetch property favorites and map to card data
      this.favoriteService.getFavoritesByUserAndProperty(userId).subscribe(favs => {
        const validFavs = favs.filter(fav => !!fav.propertyID);
        Promise.all(
          validFavs.map(fav =>
            this.propertiesService.getPropertyDetails(fav.propertyID!).toPromise()
              .then(details => ({
                ...fav,
                type: 'Vivienda',
                name: details?.title || fav.propertyID,
                description: details?.description || '',
                address: details?.address || '',
                owner: (details as any)?.userFullName || (details as any)?.ownerFullName || '',
                image: details?.imagesURL && details.imagesURL.length > 0 ? details.imagesURL[0] : null
              }))
          )
        ).then(cards => {
          this.propertyFavorites = cards;
          this.updateAllFavorites();
        });
      });
    }
  }

  updateAllFavorites() {
    this.allFavorites = [...this.buildingFavorites, ...this.propertyFavorites];
  }

  goToFavorite(fav: any) {
    if (fav.type === 'Edificio') {
      this.goToBuilding(fav.buildingID);
    } else if (fav.type === 'Vivienda') {
      this.goToProperty(fav.propertyID);
    }
  }

  goToProperty(propertyID: string) {
    this.router.navigate(['/properties', propertyID]);
  }

  goToBuilding(buildingID: string) {
    // Navega al home con query param para que el home-page abra el detalle del edificio
    this.router.navigate([''], { queryParams: { building: buildingID } });
  }
}
